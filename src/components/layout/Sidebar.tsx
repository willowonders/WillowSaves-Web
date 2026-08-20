'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useFab } from '@/lib/fab-context';
import { cn } from '@/lib/utils';
import { Plus, Receipt, Banknote, ArrowDownToLine, ArrowUpFromLine, LayoutDashboard, PiggyBank, Landmark, CreditCard } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const navTabs = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/savings', label: 'Savings', icon: PiggyBank },
  { href: '/bank', label: 'Bank', icon: Landmark },
  { href: '/expenses', label: 'Expenses', icon: CreditCard },
];

export function Sidebar() {
  const pathname = usePathname();
  const { openModal } = useFab();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  const actions = [
    { icon: <Receipt size={16} />, label: 'Add Expense', color: 'text-danger', action: 'expense' as const },
    { icon: <Banknote size={16} />, label: 'Add Allowance', color: 'text-primary', action: 'allowance' as const },
    { icon: <ArrowDownToLine size={16} />, label: 'Deposit to Bank', color: 'text-primary', action: 'deposit' as const },
    { icon: <ArrowUpFromLine size={16} />, label: 'Withdraw from Bank', color: 'text-danger', action: 'withdraw' as const },
  ];

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-60 bg-white dark:bg-canvas-dark-elevated border-r border-hairline-light dark:border-hairline-dark flex-col z-40">
      {/* Logo */}
      <div className="h-16 flex items-center gap-2.5 px-5 border-b border-hairline-light dark:border-hairline-dark">
        <img src="/logo-light.png" alt="WillowSaves" className="w-10 h-10 rounded-full object-cover dark:hidden" />
        <img src="/logo-dark.png" alt="WillowSaves" className="w-10 h-10 rounded-full object-cover hidden dark:block" />
        <span className="font-display text-lg font-bold text-ink dark:text-ink-dark">
          WillowSaves
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3">
        <div className="space-y-1">
          {navTabs.map((tab) => {
            const isActive = pathname === tab.href;
            const Icon = tab.icon;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200',
                  isActive
                    ? 'bg-primary text-on-primary'
                    : 'text-shade-50 dark:text-shade-40 hover:text-ink dark:hover:text-ink-dark hover:bg-shade-20/50 dark:hover:bg-shade-70/50'
                )}
              >
                <Icon size={18} />
                {tab.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bottom: Theme toggle only */}
      <div className="p-3 border-t border-hairline-light dark:border-hairline-dark">
        <div className="flex justify-center">
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
}
