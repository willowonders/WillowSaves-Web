'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { HelpModal } from '@/components/ui/HelpModal';
import { useFab } from '@/lib/fab-context';
import { cn } from '@/lib/utils';
import { Plus, Receipt, Banknote, ArrowDownToLine, ArrowUpFromLine, HelpCircle, LayoutDashboard, PiggyBank, Landmark, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navTabs = [
  { href: '/', label: 'Home', icon: LayoutDashboard },
  { href: '/savings', label: 'Savings', icon: PiggyBank },
  { href: '/bank', label: 'Bank', icon: Landmark },
  { href: '/expenses', label: 'Expenses', icon: CreditCard },
];

export function Header() {
  const pathname = usePathname();
  const { openModal } = useFab();
  const [menuOpen, setMenuOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
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
      <header className="lg:hidden h-14 bg-white dark:bg-canvas-dark-elevated border-b border-hairline-light dark:border-hairline-dark sticky top-0 z-30">
        <div className="flex items-center justify-between px-4 h-full">
          {/* Left: Logo */}
          <div className="flex items-center gap-2">
            <img src="/logo-light.png" alt="WillowSaves" className="w-8 h-8 rounded-full object-cover dark:hidden" />
            <img src="/logo-dark.png" alt="WillowSaves" className="w-8 h-8 rounded-full object-cover hidden dark:block" />
            <span className="font-display text-base font-bold text-ink dark:text-ink-dark">
              WillowSaves
            </span>
          </div>

          {/* Right: Help + Theme toggle */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setHelpOpen(true)}
              className="h-8 w-8 rounded-full flex items-center justify-center cursor-pointer hover:bg-shade-20/50 dark:hover:bg-shade-70/50 transition-colors"
            >
              <HelpCircle size={18} className="text-shade-50" />
            </button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <HelpModal open={helpOpen} onClose={() => setHelpOpen(false)} />

      {/* Bottom bar - mobile only */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-canvas-dark-elevated border-t border-hairline-light dark:border-hairline-dark z-40 pb-safe">
        <div className="flex items-center justify-around h-16">
          {navTabs.map((tab) => {
            const isActive = pathname === tab.href;
            const Icon = tab.icon;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  'flex flex-col items-center justify-center gap-0.5 w-full h-full transition-colors',
                  isActive
                    ? 'text-primary'
                    : 'text-shade-40 dark:text-shade-50'
                )}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-semibold">{tab.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Floating FAB - mobile only */}
      <div className="lg:hidden fixed bottom-20 right-6 z-50">
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
