'use client';

import React from 'react';
import { useBalance } from '../context/BalanceContext';
import styles from '../styles/Header.module.css';

export const Header: React.FC = () => {
  const { balance } = useBalance();

  return (
    <header className={styles.header}>
      <h1>Campaign®</h1>
      <div className={styles.balance}>
        Balance: ${balance.toLocaleString()}
      </div>
    </header>
  );
};
