'use client';

import React from 'react';
import { CampaignProvider } from '../context/CampaignContext';
import { BalanceProvider } from '../context/BalanceContext';
import { Header } from './Header';

export const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <BalanceProvider>
      <CampaignProvider>
        <Header />
        <main className="container">
          {children}
        </main>
      </CampaignProvider>
    </BalanceProvider>
  );
}; 