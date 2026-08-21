'use client';

import { useState, useCallback, useEffect } from 'react';
import { Expense, Allowance, BankTransaction, BankState } from '@/types';
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();
const USE_SUPABASE = !!process.env.NEXT_PUBLIC_SUPABASE_URL;

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function getPhilippineDate(): string {
  const now = new Date();
  const utc8 = new Date(now.getTime() + 8 * 60 * 60 * 1000);
  return utc8.toISOString().split('T')[0];
}

function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, value: T) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

// ─── User ID (set by AuthProvider) ─────────────────────────
let _userId: string | null = null;
let _userIdListeners = new Set<() => void>();

export function setAuthUserId(id: string | null) {
  _userId = id;
  _userIdListeners.forEach(l => l());
  if (id) {
    _initialized = false;
    initializeStore();
  }
}

export function getAuthUserId() {
  return _userId;
}

// ─── Singleton State ────────────────────────────────────────
let _expenses: Expense[] = [];
let _allowances: Allowance[] = [];
let _bankState: BankState = { balance: 0, transactions: [] };
let _gcashState: BankState = { balance: 0, transactions: [] };
let _initialized = false;
const _listeners = new Set<() => void>();

function notify() {
  _listeners.forEach(l => l());
}

function subscribe(listener: () => void) {
  _listeners.add(listener);
  return () => { _listeners.delete(listener); };
}

function useSyncStore() {
  const [, forceRender] = useState(0);
  useEffect(() => subscribe(() => forceRender(n => n + 1)), []);
}

async function initializeStore() {
  if (_initialized || typeof window === 'undefined' || !_userId) return;
  _initialized = true;

  if (USE_SUPABASE) {
    const [expensesRes, allowancesRes, bankTxRes, bankStateRes, gcashStateRes] = await Promise.all([
      supabase.from('expenses').select('*').eq('user_id', _userId).order('created_at', { ascending: false }),
      supabase.from('allowances').select('*').eq('user_id', _userId).order('created_at', { ascending: false }),
      supabase.from('bank_transactions').select('*').eq('user_id', _userId).order('created_at', { ascending: false }),
      supabase.from('bank_state').select('balance').eq('user_id', _userId).eq('id', 'main').single(),
      supabase.from('bank_state').select('balance').eq('user_id', _userId).eq('id', 'gcash').single(),
    ]);
    const allTx = (bankTxRes.data || []).map((r: any) => ({ id: r.id, amount: r.amount, type: r.type, source: r.source || 'other', account: r.account || 'bank', note: r.note || '', date: r.date, createdAt: r.created_at }));
    _expenses = (expensesRes.data || []).map((r: any) => ({ id: r.id, amount: r.amount, category: r.category, date: r.date, notes: r.notes || '', createdAt: r.created_at, source: r.source || 'allowance', bankTransactionId: r.bank_transaction_id }));
    _allowances = (allowancesRes.data || []).map((r: any) => ({ id: r.id, amount: r.amount, label: r.label, date: r.date, createdAt: r.created_at, linkedTransactionId: r.linked_transaction_id }));
    const bankTx = allTx.filter(t => (t.account || 'bank') === 'bank');
    const gcashTx = allTx.filter(t => t.account === 'gcash');
    _bankState = {
      balance: bankStateRes.data?.balance ?? 0,
      transactions: bankTx,
    };
    _gcashState = {
      balance: gcashStateRes.data?.balance ?? 0,
      transactions: gcashTx,
    };
  } else {
    _expenses = loadFromStorage<Expense[]>('willow-saves-expenses', []);
    _allowances = loadFromStorage<Allowance[]>('willow-saves-allowance', []);
    _bankState = loadFromStorage<BankState>('willow-saves-bank', { balance: 0, transactions: [] });
    _gcashState = loadFromStorage<BankState>('willow-saves-gcash', { balance: 0, transactions: [] });
  }
  notify();
}

// ─── Undo ───────────────────────────────────────────────────
export function useUndo() {
  const [pendingItem, setPendingItem] = useState<{
    type: 'expense' | 'allowance' | 'bank';
    data: Expense | Allowance | BankTransaction;
  } | null>(null);
  const [timeoutId, setTimeoutId] = useState<ReturnType<typeof setTimeout> | null>(null);

  const queueUndo = useCallback((item: { type: 'expense' | 'allowance' | 'bank'; data: Expense | Allowance | BankTransaction }) => {
    if (timeoutId) clearTimeout(timeoutId);
    setPendingItem(item);
    const id = setTimeout(() => { setPendingItem(null); setTimeoutId(null); }, 5000);
    setTimeoutId(id);
  }, [timeoutId]);

  const dismissUndo = useCallback(() => {
    if (timeoutId) clearTimeout(timeoutId);
    setPendingItem(null);
    setTimeoutId(null);
  }, [timeoutId]);

  return { pendingItem, queueUndo, dismissUndo };
}

// ─── Bank Helpers (usable from expense store) ───────────────
function _bankWithdrawDirect(account: 'bank' | 'gcash', amount: number, note: string): BankTransaction {
  const stateRef = account === 'bank' ? _bankRef : _gcashRef;
  const storageKey = account === 'bank' ? 'willow-saves-bank' : 'willow-saves-gcash';
  const supabaseId = account === 'bank' ? 'main' : 'gcash';
  const transaction: BankTransaction = { id: generateId(), type: 'withdraw', amount, source: 'other', account, date: getPhilippineDate(), note, createdAt: new Date().toISOString() };
  const state = stateRef.current;
  stateRef.current = { balance: Math.max(0, state.balance - amount), transactions: [transaction, ...state.transactions] };
  saveToStorage(storageKey, stateRef.current);
  if (USE_SUPABASE && _userId) {
    supabase.from('bank_transactions').insert({ id: transaction.id, amount, type: 'withdraw', source: 'other', account, note, date: transaction.date, user_id: _userId });
    supabase.from('bank_state').select('balance').eq('user_id', _userId).eq('id', supabaseId).single().then(({ data }) => {
      supabase.from('bank_state').upsert({ user_id: _userId, id: supabaseId, balance: Math.max(0, (data?.balance ?? 0) - amount) });
    });
  }
  notify();
  return transaction;
}

function _bankDepositDirect(account: 'bank' | 'gcash', amount: number, note: string): BankTransaction {
  const stateRef = account === 'bank' ? _bankRef : _gcashRef;
  const storageKey = account === 'bank' ? 'willow-saves-bank' : 'willow-saves-gcash';
  const supabaseId = account === 'bank' ? 'main' : 'gcash';
  const transaction: BankTransaction = { id: generateId(), type: 'deposit', amount, source: 'other', account, date: getPhilippineDate(), note, createdAt: new Date().toISOString() };
  const state = stateRef.current;
  stateRef.current = { balance: state.balance + amount, transactions: [transaction, ...state.transactions] };
  saveToStorage(storageKey, stateRef.current);
  if (USE_SUPABASE && _userId) {
    supabase.from('bank_transactions').insert({ id: transaction.id, amount, type: 'deposit', source: 'other', account, note, date: transaction.date, user_id: _userId });
    supabase.from('bank_state').select('balance').eq('user_id', _userId).eq('id', supabaseId).single().then(({ data }) => {
      supabase.from('bank_state').upsert({ user_id: _userId, id: supabaseId, balance: (data?.balance ?? 0) + amount });
    });
  }
  notify();
  return transaction;
}

// ─── Expenses ───────────────────────────────────────────────
export function useExpensesStore() {
  useSyncStore();
  useEffect(() => { initializeStore(); }, []);

  const addExpense = useCallback(async (amount: number, category: string, date: string, notes: string, source: 'allowance' | 'bank' | 'gcash' = 'allowance') => {
    let bankTransactionId: string | undefined;
    if (source === 'bank' || source === 'gcash') {
      const tx = _bankWithdrawDirect(source, amount, `Expense: ${category}${notes ? ` — ${notes}` : ''}`);
      bankTransactionId = tx.id;
    }
    const newExpense: Expense = { id: generateId(), amount, category, date, notes, createdAt: new Date().toISOString(), source, bankTransactionId };
    _expenses = [newExpense, ..._expenses];
    saveToStorage('willow-saves-expenses', _expenses);
    if (USE_SUPABASE && _userId) await supabase.from('expenses').insert({ id: newExpense.id, amount, category, date, notes, source, bank_transaction_id: bankTransactionId || null, user_id: _userId });
    notify();
    return newExpense;
  }, []);

  const deleteExpense = useCallback(async (id: string) => {
    const expense = _expenses.find(e => e.id === id);
    if (expense?.bankTransactionId && expense.source) {
      _bankDepositDirect(expense.source as 'bank' | 'gcash', expense.amount, `Refund: ${expense.category}`);
    }
    _expenses = _expenses.filter(e => e.id !== id);
    saveToStorage('willow-saves-expenses', _expenses);
    if (USE_SUPABASE) await supabase.from('expenses').delete().eq('id', id);
    notify();
  }, []);

  const updateExpense = useCallback(async (updated: Expense) => {
    const old = _expenses.find(e => e.id === updated.id);
    if (old) {
      const oldSource = old.source || 'allowance';
      const newSource = updated.source || 'allowance';
      const oldAccount = oldSource as 'bank' | 'gcash';
      const newAccount = newSource as 'bank' | 'gcash';

      if (oldSource !== 'allowance' && newSource !== 'allowance') {
        if (oldAccount !== newAccount) {
          _bankDepositDirect(oldAccount, old.amount, `Refund: ${old.category}`);
          const tx = _bankWithdrawDirect(newAccount, updated.amount, `Expense: ${updated.category}${updated.notes ? ` — ${updated.notes}` : ''}`);
          updated.bankTransactionId = tx.id;
        } else {
          _bankDepositDirect(oldAccount, old.amount, `Refund: ${old.category}`);
          const tx = _bankWithdrawDirect(newAccount, updated.amount, `Expense: ${updated.category}${updated.notes ? ` — ${updated.notes}` : ''}`);
          updated.bankTransactionId = tx.id;
        }
      } else if (oldSource !== 'allowance' && newSource === 'allowance') {
        _bankDepositDirect(oldAccount, old.amount, `Refund: ${old.category}`);
        updated.bankTransactionId = undefined;
      } else if (oldSource === 'allowance' && newSource !== 'allowance') {
        const tx = _bankWithdrawDirect(newAccount, updated.amount, `Expense: ${updated.category}${updated.notes ? ` — ${updated.notes}` : ''}`);
        updated.bankTransactionId = tx.id;
      }
    }
    _expenses = _expenses.map(e => (e.id === updated.id ? updated : e));
    saveToStorage('willow-saves-expenses', _expenses);
    if (USE_SUPABASE && _userId) await supabase.from('expenses').update({ amount: updated.amount, category: updated.category, date: updated.date, notes: updated.notes, source: updated.source || 'allowance', bank_transaction_id: updated.bankTransactionId || null }).eq('id', updated.id);
    notify();
  }, []);

  return { expenses: _expenses, addExpense, deleteExpense, updateExpense, loaded: _initialized };
}

// ─── Allowances ─────────────────────────────────────────────
export function useAllowanceStore() {
  useSyncStore();
  useEffect(() => { initializeStore(); }, []);

  const addAllowance = useCallback(async (amount: number, label: string, date: string, linkedTransactionId?: string) => {
    const newAllowance: Allowance = { id: generateId(), amount, label, date, createdAt: new Date().toISOString(), ...(linkedTransactionId && { linkedTransactionId }) };
    _allowances = [newAllowance, ..._allowances];
    saveToStorage('willow-saves-allowance', _allowances);
    if (USE_SUPABASE && _userId) await supabase.from('allowances').insert({ id: newAllowance.id, amount, label, date, linked_transaction_id: linkedTransactionId || null, user_id: _userId });
    notify();
    return newAllowance;
  }, []);

  const deleteAllowance = useCallback(async (id: string) => {
    _allowances = _allowances.filter(a => a.id !== id);
    saveToStorage('willow-saves-allowance', _allowances);
    if (USE_SUPABASE) await supabase.from('allowances').delete().eq('id', id);
    notify();
  }, []);

  const updateAllowance = useCallback(async (updated: Allowance) => {
    _allowances = _allowances.map(a => (a.id === updated.id ? updated : a));
    saveToStorage('willow-saves-allowance', _allowances);
    if (USE_SUPABASE) await supabase.from('allowances').update({ amount: updated.amount, label: updated.label, date: updated.date }).eq('id', updated.id);
    notify();
  }, []);

  return { allowances: _allowances, addAllowance, deleteAllowance, updateAllowance, loaded: _initialized };
}

// ─── Bank ───────────────────────────────────────────────────
function createBankHooks(stateRef: { current: BankState }, storageKey: string, supabaseId: string) {
  return function useBankHook() {
    useSyncStore();
    useEffect(() => { initializeStore(); }, []);

    const deposit = useCallback(async (amount: number, source: 'savings' | 'other', note: string) => {
      const transaction: BankTransaction = { id: generateId(), type: 'deposit', amount, source, account: supabaseId === 'main' ? 'bank' : 'gcash', date: getPhilippineDate(), note, createdAt: new Date().toISOString() };
      const state = stateRef.current;
      stateRef.current = { balance: state.balance + amount, transactions: [transaction, ...state.transactions] };
      saveToStorage(storageKey, stateRef.current);
      if (USE_SUPABASE && _userId) {
        await supabase.from('bank_transactions').insert({ id: transaction.id, amount, type: 'deposit', source, account: transaction.account, note, date: transaction.date, user_id: _userId });
        const { data: existing } = await supabase.from('bank_state').select('balance').eq('user_id', _userId).eq('id', supabaseId).single();
        await supabase.from('bank_state').upsert({ user_id: _userId, id: supabaseId, balance: (existing?.balance ?? 0) + amount });
      }
      notify();
      return transaction;
    }, []);

    const withdraw = useCallback(async (amount: number, note: string) => {
      const transaction: BankTransaction = { id: generateId(), type: 'withdraw', amount, source: 'other', account: supabaseId === 'main' ? 'bank' : 'gcash', date: getPhilippineDate(), note, createdAt: new Date().toISOString() };
      const state = stateRef.current;
      stateRef.current = { balance: Math.max(0, state.balance - amount), transactions: [transaction, ...state.transactions] };
      saveToStorage(storageKey, stateRef.current);
      if (USE_SUPABASE && _userId) {
        await supabase.from('bank_transactions').insert({ id: transaction.id, amount, type: 'withdraw', source: 'other', account: transaction.account, note, date: transaction.date, user_id: _userId });
        const { data: existing } = await supabase.from('bank_state').select('balance').eq('user_id', _userId).eq('id', supabaseId).single();
        await supabase.from('bank_state').upsert({ user_id: _userId, id: supabaseId, balance: Math.max(0, (existing?.balance ?? 0) - amount) });
      }
      notify();
      return transaction;
    }, []);

    const deleteTransaction = useCallback(async (id: string) => {
      const state = stateRef.current;
      const tx = state.transactions.find(t => t.id === id);
      if (!tx) return;
      const newBalance = tx.type === 'deposit' ? state.balance - tx.amount : state.balance + tx.amount;
      stateRef.current = { balance: Math.max(0, newBalance), transactions: state.transactions.filter(t => t.id !== id) };
      saveToStorage(storageKey, stateRef.current);
      if (USE_SUPABASE && _userId) {
        await supabase.from('bank_transactions').delete().eq('id', id);
        const { data: existing } = await supabase.from('bank_state').select('balance').eq('user_id', _userId).eq('id', supabaseId).single();
        const adj = tx.type === 'deposit' ? -tx.amount : tx.amount;
        await supabase.from('bank_state').upsert({ user_id: _userId, id: supabaseId, balance: Math.max(0, (existing?.balance ?? 0) + adj) });
      }
      notify();
    }, []);

    const updateTransaction = useCallback(async (id: string, updates: Partial<Pick<BankTransaction, 'amount' | 'note' | 'date'>>) => {
      const state = stateRef.current;
      const tx = state.transactions.find(t => t.id === id);
      if (!tx) return;
      const oldAmount = tx.amount;
      const newAmount = updates.amount ?? oldAmount;
      const newBalance = tx.type === 'withdraw' ? state.balance + oldAmount - newAmount : state.balance - oldAmount + newAmount;
      stateRef.current = { balance: Math.max(0, newBalance), transactions: state.transactions.map(t => (t.id === id ? { ...t, ...updates, amount: newAmount } : t)) };
      saveToStorage(storageKey, stateRef.current);
      if (USE_SUPABASE && _userId) {
        await supabase.from('bank_transactions').update({ amount: updates.amount, note: updates.note, date: updates.date }).eq('id', id);
        const { data: allTx } = await supabase.from('bank_transactions').select('type, amount').eq('user_id', _userId).eq('account', tx.account || 'bank');
        if (allTx) {
          const recalculated = allTx.reduce((acc: number, t: any) => t.type === 'deposit' ? acc + t.amount : acc - t.amount, 0);
          await supabase.from('bank_state').upsert({ user_id: _userId, id: supabaseId, balance: Math.max(0, recalculated) });
        }
      }
      notify();
    }, []);

    const state = stateRef.current;
    const totalDeposited = state.transactions.filter(t => t.type === 'deposit').reduce((sum, t) => sum + t.amount, 0);
    const totalWithdrawn = state.transactions.filter(t => t.type === 'withdraw').reduce((sum, t) => sum + t.amount, 0);

    return { ...state, deposit, withdraw, deleteTransaction, updateTransaction, totalDeposited, totalWithdrawn, loaded: _initialized };
  };
}

const _bankRef = { current: _bankState };
const _gcashRef = { current: _gcashState };

// Proxy getters to keep refs in sync
Object.defineProperty(_bankRef, 'current', {
  get() { return _bankState; },
  set(v) { _bankState = v; },
});
Object.defineProperty(_gcashRef, 'current', {
  get() { return _gcashState; },
  set(v) { _gcashState = v; },
});

export const useBankStore = createBankHooks(_bankRef, 'willow-saves-bank', 'main');
export const useGcashStore = createBankHooks(_gcashRef, 'willow-saves-gcash', 'gcash');

// ─── Savings ────────────────────────────────────────────────
export function useSavings() {
  useSyncStore();
  useEffect(() => { initializeStore(); }, []);

  const totalSaved = _allowances.reduce((sum, a) => sum + a.amount, 0);
  const totalExpenses = _expenses.filter(e => !e.source || e.source === 'allowance').reduce((sum, e) => sum + e.amount, 0);
  const totalBankDeposited = _bankState.transactions.filter(t => t.type === 'deposit' && t.source === 'savings').reduce((sum, t) => sum + t.amount, 0);
  const totalBankWithdrawn = _bankState.transactions.filter(t => t.type === 'withdraw').reduce((sum, t) => sum + t.amount, 0);
  const totalGcashDeposited = _gcashState.transactions.filter(t => t.type === 'deposit' && t.source === 'savings').reduce((sum, t) => sum + t.amount, 0);
  const totalGcashWithdrawn = _gcashState.transactions.filter(t => t.type === 'withdraw').reduce((sum, t) => sum + t.amount, 0);
  const totalDeposited = totalBankDeposited + totalGcashDeposited;
  const totalWithdrawn = totalBankWithdrawn + totalGcashWithdrawn;
  const savings = totalSaved - totalExpenses - totalDeposited + totalWithdrawn;

  return { savings, totalSaved, totalExpenses, totalDeposited, totalWithdrawn, loaded: _initialized };
}

// ─── Wrapper hooks ──────────────────────────────────────────
export function useExpenses() {
  return useExpensesStore();
}

export function useAllowances() {
  const store = useAllowanceStore();
  const totalSaved = store.allowances.reduce((sum, a) => sum + a.amount, 0);
  return { ...store, totalSaved };
}

export function useBank() {
  return useBankStore();
}

export function useGcash() {
  return useGcashStore();
}
