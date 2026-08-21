'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useFab } from '@/lib/fab-context';
import { useAllowanceStore, useExpensesStore } from '@/lib/store';
import { AllowanceForm } from '@/components/forms/AllowanceForm';
import { ExpenseForm } from '@/components/forms/ExpenseForm';
import { BankDepositModal } from '@/components/bank/BankDepositModal';
import { BankWithdrawModal } from '@/components/bank/BankWithdrawModal';
import { usePathname } from 'next/navigation';

export function GlobalModals() {
  const { activeModal, closeModal } = useFab();
  const pathname = usePathname();
  const { addAllowance } = useAllowanceStore();
  const { addExpense } = useExpensesStore();

  const isOnExpensesPage = pathname === '/expenses';

  return (
    <AnimatePresence>
      {/* Expense Modal — only render when NOT on expenses page (that page handles its own) */}
      {activeModal === 'expense' && !isOnExpensesPage && (
        <motion.div key="expense-modal-global" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white dark:bg-canvas-dark-elevated rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-heading font-bold text-ink dark:text-ink-dark mb-4">New Expense</h2>
            <ExpenseForm onSave={(amount: number, category: string, date: string, notes: string, source: 'allowance' | 'bank' | 'gcash') => { addExpense(amount, category, date, notes, source); closeModal(); }} onClose={closeModal} />
          </motion.div>
        </motion.div>
      )}

      {/* Allowance Modal */}
      {activeModal === 'allowance' && (
        <motion.div key="allowance-modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white dark:bg-canvas-dark-elevated rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-lg font-heading font-bold text-ink dark:text-ink-dark mb-4">Add Allowance</h2>
            <AllowanceForm onSave={(amount: number, label: string, date: string) => { addAllowance(amount, label, date); closeModal(); }} onClose={closeModal} />
          </motion.div>
        </motion.div>
      )}

      {/* Deposit Modal */}
      {activeModal === 'deposit' && <BankDepositModal onClose={closeModal} />}

      {/* Withdraw Modal */}
      {activeModal === 'withdraw' && <BankWithdrawModal onClose={closeModal} />}
    </AnimatePresence>
  );
}
