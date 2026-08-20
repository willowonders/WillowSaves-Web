'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { PendingUndoItem } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface UndoToastProps {
  pendingItem: PendingUndoItem | null;
  onUndo: () => void;
  onDismiss: () => void;
}

export function UndoToast({ pendingItem, onUndo, onDismiss }: UndoToastProps) {
  const getLabel = () => {
    if (!pendingItem) return '';
    const d = pendingItem.data;
    if ('notes' in d && d.notes) return `${d.notes} - ${formatCurrency(d.amount)}`;
    if ('label' in d) return `${d.label} - ${formatCurrency(d.amount)}`;
    if ('type' in d) return `${d.type === 'deposit' ? 'Deposit' : 'Withdrawal'} - ${formatCurrency(d.amount)}`;
    return formatCurrency(d.amount);
  };

  return (
    <AnimatePresence>
      {pendingItem && (
        <motion.div
          className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
        >
          <div className="bg-white dark:bg-canvas-dark-card border-2 border-primary rounded-2xl px-4 py-3 shadow-lg flex items-center gap-3 min-w-[280px]">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-shade-50 font-medium">Deleted</p>
              <p className="text-sm font-semibold text-ink dark:text-ink-dark truncate">{getLabel()}</p>
            </div>
            <button
              onClick={onUndo}
              className="text-sm font-bold text-primary hover:text-primary-dark cursor-pointer px-2 py-1"
            >
              UNDO
            </button>
            <button
              onClick={onDismiss}
              className="p-1 hover:bg-shade-20/50 dark:hover:bg-shade-70/50 rounded-lg cursor-pointer"
            >
              <X size={14} className="text-shade-40" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
