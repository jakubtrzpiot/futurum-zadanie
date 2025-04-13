'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface BalanceContextType {
  balance: number;
  updateBalance: (amount: number) => void;
}

const BalanceContext = createContext<BalanceContextType | undefined>(undefined);

const STORAGE_KEY = 'campaign_balance';
const INITIAL_BALANCE = 100000;

export const BalanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [balance, setBalance] = useState<number>(INITIAL_BALANCE);

  useEffect(() => {
    // Load balance from localStorage on mount
    const storedBalance = localStorage.getItem(STORAGE_KEY);
    if (storedBalance) {
      setBalance(Number(storedBalance));
    } else {
      // Set initial balance if not found
      localStorage.setItem(STORAGE_KEY, INITIAL_BALANCE.toString());
    }
  }, []);

  const updateBalance = (amount: number) => {
    setBalance(amount);
    localStorage.setItem(STORAGE_KEY, amount.toString());
  };

  return (
    <BalanceContext.Provider value={{ balance, updateBalance }}>
      {children}
    </BalanceContext.Provider>
  );
};

export const useBalance = () => {
  const context = useContext(BalanceContext);
  if (context === undefined) {
    throw new Error('useBalance must be used within a BalanceProvider');
  }
  return context;
}; 