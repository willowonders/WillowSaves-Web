'use client';

import { DepositForm } from '@/components/bank/DepositForm';
import { useBankStore, useGcashStore } from '@/lib/store';
import { motion } from 'framer-motion';

interface BankDepositModalProps {
  onClose: () => void;
}

export function BankDepositModal({ onClose }: BankDepositModalProps) {
  const bankStore = useBankStore();
  const gcashStore = useGcashStore();

  const handleDeposit = (amount: number, source: 'savings' | 'other', note: string, account: 'bank' | 'gcash') => {
    if (account === 'gcash') {
      gcashStore.deposit(amount, source, note);
    } else {
      bankStore.deposit(amount, source, note);
    }
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white dark:bg-canvas-dark-elevated rounded-2xl p-6 w-full max-w-md"
      >
        <h2 className="text-lg font-heading font-bold text-ink dark:text-ink-dark mb-4">Deposit</h2>
        <DepositForm onDeposit={handleDeposit} onClose={onClose} />
      </motion.div>
    </motion.div>
  );
}
