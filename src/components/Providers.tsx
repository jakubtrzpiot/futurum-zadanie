'use client';

import React from 'react';
import { CampaignProvider } from '../context/CampaignContext';
import { BalanceProvider } from '../context/BalanceContext';
import { Header } from './Header';

export const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <BalanceProvider>
      <CampaignProvider>
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Header />
          <main style={{ flex: 1, overflow: 'auto' }}>
            {children}
          </main>
        </div>
      </CampaignProvider>
    </BalanceProvider>
  );
}; 