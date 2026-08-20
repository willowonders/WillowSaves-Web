-- Run this in Supabase SQL Editor (https://app.supabase.com > SQL Editor)

-- Expenses table
create table if not exists expenses (
  id text primary key,
  amount numeric not null,
  category text not null,
  date text not null,
  notes text default '',
  created_at timestamp with time zone default now(),
  user_id uuid references auth.users(id) not null
);

-- Allowances table
create table if not exists allowances (
  id text primary key,
  amount numeric not null,
  label text not null,
  date text not null,
  linked_transaction_id text,
  created_at timestamp with time zone default now(),
  user_id uuid references auth.users(id) not null
);

-- Bank transactions table
create table if not exists bank_transactions (
  id text primary key,
  amount numeric not null,
  type text not null check (type in ('deposit', 'withdraw')),
  source text default 'other',
  note text default '',
  date text not null,
  created_at timestamp with time zone default now(),
  user_id uuid references auth.users(id) not null
);

-- Bank state (single row per user for balance)
create table if not exists bank_state (
  id text default 'main',
  balance numeric not null default 0,
  user_id uuid references auth.users(id) not null,
  primary key (id, user_id)
);

-- Enable Row Level Security
alter table expenses enable row level security;
alter table allowances enable row level security;
alter table bank_transactions enable row level security;
alter table bank_state enable row level security;

-- Drop old open policies
drop policy if exists "Allow all on expenses" on expenses;
drop policy if exists "Allow all on allowances" on allowances;
drop policy if exists "Allow all on bank_transactions" on bank_transactions;
drop policy if exists "Allow all on bank_state" on bank_state;

-- User-scoped policies: expenses
create policy "Users can read own expenses" on expenses
  for select using (auth.uid() = user_id);
create policy "Users can insert own expenses" on expenses
  for insert with check (auth.uid() = user_id);
create policy "Users can update own expenses" on expenses
  for update using (auth.uid() = user_id);
create policy "Users can delete own expenses" on expenses
  for delete using (auth.uid() = user_id);

-- User-scoped policies: allowances
create policy "Users can read own allowances" on allowances
  for select using (auth.uid() = user_id);
create policy "Users can insert own allowances" on allowances
  for insert with check (auth.uid() = user_id);
create policy "Users can update own allowances" on allowances
  for update using (auth.uid() = user_id);
create policy "Users can delete own allowances" on allowances
  for delete using (auth.uid() = user_id);

-- User-scoped policies: bank_transactions
create policy "Users can read own bank_transactions" on bank_transactions
  for select using (auth.uid() = user_id);
create policy "Users can insert own bank_transactions" on bank_transactions
  for insert with check (auth.uid() = user_id);
create policy "Users can update own bank_transactions" on bank_transactions
  for update using (auth.uid() = user_id);
create policy "Users can delete own bank_transactions" on bank_transactions
  for delete using (auth.uid() = user_id);

-- User-scoped policies: bank_state
create policy "Users can read own bank_state" on bank_state
  for select using (auth.uid() = user_id);
create policy "Users can insert own bank_state" on bank_state
  for insert with check (auth.uid() = user_id);
create policy "Users can update own bank_state" on bank_state
  for update using (auth.uid() = user_id);
create policy "Users can delete own bank_state" on bank_state
  for delete using (auth.uid() = user_id);
