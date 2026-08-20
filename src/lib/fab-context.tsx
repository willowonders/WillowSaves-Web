'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

type FabAction = 'expense' | 'allowance' | 'deposit' | 'withdraw';

interface FabContextType {
  activeModal: FabAction | null;
  openModal: (action: FabAction) => void;
  closeModal: () => void;
}

const FabContext = createContext<FabContextType>({
  activeModal: null,
  openModal: () => {},
  closeModal: () => {},
});

export function useFab() {
  return useContext(FabContext);
}

export function FabProvider({ children }: { children: ReactNode }) {
  const [activeModal, setActiveModal] = useState<FabAction | null>(null);

  const openModal = useCallback((action: FabAction) => {
    setActiveModal(action);
  }, []);

  const closeModal = useCallback(() => {
    setActiveModal(null);
  }, []);

  return (
    <FabContext.Provider value={{ activeModal, openModal, closeModal }}>
      {children}
    </FabContext.Provider>
  );
}
