'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useFab } from '@/lib/fab-context';
import { cn } from '@/lib/utils';
import { Plus, Receipt, Banknote, ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navTabs = [
  { href: '/', label: 'Dashboard' },
  { href: '/savings', label: 'Savings' },
  { href: '/bank', label: 'Bank' },
  { href: '/expenses', label: 'Expenses' },
];

export function Header() {
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
    <>
      {/* Top bar - mobile only */}
      <header className="lg:hidden h-auto min-h-14 bg-white dark:bg-canvas-dark-elevated border-b border-hairline-light dark:border-hairline-dark sticky top-0 z-30">
        <div className="flex flex-wrap items-center gap-2 px-4 py-2">
          {/* Left: Logo */}
          <div className="flex items-center gap-2 mr-2">
            <img src="/logo-light.png" alt="WillowSaves" className="w-8 h-8 rounded-full object-cover dark:hidden" />
            <img src="/logo-dark.png" alt="WillowSaves" className="w-8 h-8 rounded-full object-cover hidden dark:block" />
            <span className="font-display text-base font-bold text-ink dark:text-ink-dark">
              WillowSaves
            </span>
          </div>

          {/* Nav tabs - wraps on mobile */}
          <nav className="flex items-center gap-1 flex-wrap flex-1 justify-center">
            {navTabs.map((tab) => {
              const isActive = pathname === tab.href;
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200',
                    isActive
                      ? 'bg-primary text-on-primary'
                      : 'text-shade-50 dark:text-shade-40 hover:text-ink dark:hover:text-ink-dark hover:bg-shade-20/50 dark:hover:bg-shade-70/50'
                  )}
                >
                  {tab.label}
                </Link>
              );
            })}
          </nav>

          {/* Right: Theme toggle only */}
          <div className="flex items-center">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Floating FAB - mobile only */}
      <div className="lg:hidden fixed bottom-6 right-6 z-50">
        <div ref={menuRef} className="relative">
          <motion.button
            onClick={() => setMenuOpen(!menuOpen)}
            className={cn(
              'w-14 h-14 rounded-full flex items-center justify-center cursor-pointer transition-colors shadow-lg',
              menuOpen
                ? 'bg-shade-60 text-white'
                : 'bg-primary text-on-primary'
            )}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <motion.div animate={{ rotate: menuOpen ? 45 : 0 }} transition={{ duration: 0.2 }}>
              <Plus size={24} />
            </motion.div>
          </motion.button>

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                className="absolute bottom-full right-0 mb-3 bg-white dark:bg-canvas-dark-elevated rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-hairline-light dark:border-hairline-dark py-1 z-50 w-48"
              >
                {actions.map((item) => (
                  <button
                    key={item.action}
                    onClick={() => { openModal(item.action); setMenuOpen(false); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-ink dark:text-ink-dark hover:bg-shade-20/50 dark:hover:bg-shade-70/50 transition-colors cursor-pointer text-left"
                  >
                    <span className={item.color}>{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
