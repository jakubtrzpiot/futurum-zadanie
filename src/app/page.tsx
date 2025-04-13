'use client';

import { useState } from 'react';
import { CampaignProvider } from '../context/CampaignContext';
import { CampaignList } from '../components/CampaignList';
import { CampaignForm } from '../components/CampaignForm';
import { Campaign } from '../types/campaign';
import styles from './page.module.css';

export default function Home() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | undefined>();

  const handleEdit = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setSelectedCampaign(undefined);
    setIsFormOpen(false);
  };

  return (
    <CampaignProvider>
      <main className={styles.main}>
        <div className={styles.header}>
          <h1>Available Campaigns</h1>
          <button
            className={styles.addButton}
            onClick={() => setIsFormOpen(true)}
          >
            Add New Campaign
          </button>
        </div>

        {isFormOpen && (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <CampaignForm
                campaign={selectedCampaign}
                onClose={handleCloseForm}
              />
            </div>
          </div>
        )}

        <CampaignList onEdit={handleEdit} />
      </main>
    </CampaignProvider>
  );
}
