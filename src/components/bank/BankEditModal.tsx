'use client';

import { Modal } from '@/components/ui/Modal';
import { TransactionEditForm } from '@/components/bank/TransactionEditForm';
import { useBankStore, useGcashStore } from '@/lib/store';
import { BankTransaction } from '@/types';

interface BankEditModalProps {
  transaction: BankTransaction;
  onClose: () => void;
}

export function BankEditModal({ transaction, onClose }: BankEditModalProps) {
  const bankStore = useBankStore();
  const gcashStore = useGcashStore();

  const handleSave = (updates: Partial<Pick<BankTransaction, 'amount' | 'note' | 'date'>>) => {
    if (transaction.account === 'gcash') {
      gcashStore.updateTransaction(transaction.id, updates);
    } else {
      bankStore.updateTransaction(transaction.id, updates);
    }
    onClose();
  };

  return (
    <Modal open={true} onClose={onClose} title="Edit Transaction">
      <TransactionEditForm transaction={transaction} onSave={handleSave} onClose={onClose} />
    </Modal>
  );
}
