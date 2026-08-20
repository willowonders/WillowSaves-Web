'use client';

import { useState, useRef, useEffect } from 'react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { HelpModal } from '@/components/ui/HelpModal';
import { useFab } from '@/lib/fab-context';
import { useAuth } from '@/lib/auth-context';
import { cn } from '@/lib/utils';
import { Plus, Receipt, Banknote, ArrowDownToLine, ArrowUpFromLine, User, LogOut, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function DesktopTopBar() {
  const { openModal } = useFab();
  const { user, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    if (menuOpen || userMenuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen, userMenuOpen]);

  const actions = [
    { icon: <Receipt size={16} />, label: 'Add Expense', color: 'text-danger', action: 'expense' as const },
    { icon: <Banknote size={16} />, label: 'Add Allowance', color: 'text-primary', action: 'allowance' as const },
    { icon: <ArrowDownToLine size={16} />, label: 'Deposit to Bank', color: 'text-primary', action: 'deposit' as const },
    { icon: <ArrowUpFromLine size={16} />, label: 'Withdraw from Bank', color: 'text-danger', action: 'withdraw' as const },
  ];

  return (
    <header className="hidden lg:flex h-16 bg-white dark:bg-canvas-dark-elevated border-b border-hairline-light dark:border-hairline-dark items-center justify-between px-6 sticky top-0 z-30">
      {/* Left spacer */}
      <div />

      {/* Right: FAB + User menu + Theme toggle */}
      <div className="flex items-center gap-3">
        <div ref={menuRef} className="relative">
          <motion.button
            onClick={() => setMenuOpen(!menuOpen)}
            className={cn(
              'h-9 px-4 rounded-full flex items-center justify-center gap-1.5 cursor-pointer transition-colors font-semibold text-sm',
              menuOpen
                ? 'bg-shade-60 text-white'
                : 'bg-primary text-on-primary'
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div animate={{ rotate: menuOpen ? 45 : 0 }} transition={{ duration: 0.2 }}>
              <Plus size={16} />
            </motion.div>
            Add New
          </motion.button>

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                className="absolute right-0 top-full mt-2 bg-white dark:bg-canvas-dark-elevated rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-hairline-light dark:border-hairline-dark py-1 z-50 w-52"
              >
                {actions.map((item) => (
                  <button
                    key={item.action}
                    onClick={() => { openModal(item.action); setMenuOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-ink dark:text-ink-dark hover:bg-shade-20/50 dark:hover:bg-shade-70/50 transition-colors cursor-pointer text-left"
                  >
                    <span className={item.color}>{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User menu */}
        <div ref={userMenuRef} className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="h-9 px-3 rounded-full bg-shade-20/40 dark:bg-shade-70/40 flex items-center gap-2 cursor-pointer hover:bg-shade-30/40 transition-colors"
          >
            <User size={14} className="text-shade-50" />
            <span className="text-xs font-semibold text-shade-50 hidden xl:inline truncate max-w-[140px]">
              {user?.email ?? 'user@email.com'}
            </span>
          </button>

          <AnimatePresence>
            {userMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                className="absolute right-0 top-full mt-2 bg-white dark:bg-canvas-dark-elevated rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-hairline-light dark:border-hairline-dark py-1 z-50 w-52"
              >
                <div className="px-4 py-2 border-b border-hairline-light dark:border-hairline-dark">
                  <p className="text-[11px] text-shade-40 font-semibold uppercase tracking-wider">Signed in as</p>
                  <p className="text-xs font-semibold text-ink dark:text-ink-dark truncate">{user?.email}</p>
                </div>
                <button
                  onClick={() => { signOut(); setUserMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-danger hover:bg-danger-soft transition-colors cursor-pointer text-left"
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={() => setHelpOpen(true)}
          className="h-9 w-9 rounded-full bg-shade-20/40 dark:bg-shade-70/40 flex items-center justify-center cursor-pointer hover:bg-shade-30/40 transition-colors"
        >
          <HelpCircle size={16} className="text-shade-50" />
        </button>

        <ThemeToggle />
      </div>

      <HelpModal open={helpOpen} onClose={() => setHelpOpen(false)} />
    </header>
  );
}
