'use client';

import { Modal } from '@/components/ui/Modal';
import { LayoutDashboard, PiggyBank, Landmark, CreditCard, Moon, HelpCircle } from 'lucide-react';

interface HelpModalProps {
  open: boolean;
  onClose: () => void;
}

const sections = [
  {
    icon: LayoutDashboard,
    title: 'Dashboard',
    items: [
      'Shows your savings rate, remaining balance, bank and GCASH balances',
      'Statistics section with daily/weekly/monthly/yearly toggles',
      'Charts for savings trends and expense trends',
      'Recent activity: latest expenses, allowances, and bank transactions',
    ],
  },
  {
    icon: PiggyBank,
    title: 'Savings',
    items: [
      'View your total calculated savings at the top',
      'Filter by Weekly, Monthly, or Yearly periods',
      'Tap + to add an allowance (quick presets: Daily 500, Weekly 1,500, Bi-weekly 3,000, Monthly 6,000)',
      'Edit or delete allowances with the pencil/trash icons',
    ],
  },
  {
    icon: CreditCard,
    title: 'Expenses',
    items: [
      'Track spending across 8 categories: Food, Transport, Shopping, Bills, Entertainment, Health, Education, Other',
      'Filter by category using the pill buttons',
      'Filter by period: Daily, Weekly, Monthly, Yearly',
      'Add expenses with amount, category, date, and optional notes',
    ],
  },
  {
    icon: Landmark,
    title: 'Bank & GCASH',
    items: [
      'View both Bank and GCASH balances side by side',
      'Deposits: add money from savings or other sources',
      'Withdrawals: take money out of bank or GCASH',
      'All transactions listed with deposit/withdrawal indicators',
    ],
  },
  {
    icon: Moon,
    title: 'Dark Mode',
    items: [
      'Tap the sun/moon icon in the top bar to toggle themes',
      'Your preference is saved and persists across sessions',
    ],
  },
];

export function HelpModal({ open, onClose }: HelpModalProps) {
  return (
    <Modal open={open} onClose={onClose} title="How to Use WillowSaves">
      <div className="space-y-6">
        {/* Intro */}
        <div className="flex items-start gap-3 p-4 rounded-xl bg-primary-subtle">
          <HelpCircle size={20} className="text-primary flex-shrink-0 mt-0.5" />
          <p className="text-sm text-ink dark:text-ink-dark">
            WillowSaves helps you track expenses, manage savings, and monitor your bank/GCASH balances. Here's how to get started.
          </p>
        </div>

        {/* Sections */}
        {sections.map((section) => (
          <div key={section.title}>
            <div className="flex items-center gap-2 mb-3">
              <section.icon size={18} className="text-primary" />
              <h3 className="text-sm font-bold text-ink dark:text-ink-dark">{section.title}</h3>
            </div>
            <ul className="space-y-2 ml-7">
              {section.items.map((item, i) => (
                <li key={i} className="text-sm text-shade-50 leading-relaxed flex items-start gap-2">
                  <span className="text-shade-40 mt-1.5 text-[10px]">●</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Savings Formula */}
        <div className="p-4 rounded-xl bg-shade-20/30 dark:bg-shade-70/30">
          <p className="text-xs font-bold text-ink dark:text-ink-dark mb-2">How Savings Are Calculated</p>
          <p className="text-xs text-shade-50 font-mono">
            Savings = Allowances - Expenses - Deposits + Withdrawals
          </p>
        </div>

        {/* Navigation */}
        <div>
          <p className="text-xs font-bold text-ink dark:text-ink-dark mb-2">Navigation</p>
          <div className="space-y-1 text-xs text-shade-50">
            <p><span className="font-semibold">Desktop:</span> Use the sidebar on the left to navigate between tabs</p>
            <p><span className="font-semibold">Mobile:</span> Use the tab buttons in the top bar or tap the + button for quick actions</p>
          </div>
        </div>
      </div>
    </Modal>
  );
}
