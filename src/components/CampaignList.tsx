import React from 'react';
import { useCampaign } from '../context/CampaignContext';
import { useBalance } from '../context/BalanceContext';
import { Campaign } from '../types/campaign';
import styles from '../styles/CampaignList.module.css';

interface CampaignListProps {
  onEdit: (campaign: Campaign) => void;
}

export const CampaignList: React.FC<CampaignListProps> = ({ onEdit }) => {
  const { campaigns, deleteCampaign } = useCampaign();
  const { balance, updateBalance } = useBalance();

  const handleDelete = (campaign: Campaign) => {
    // Add back the campaign fund to the balance if the campaign was active
    if (campaign.status === 'active') {
      updateBalance(balance + campaign.campaignFund);
    }
    
    deleteCampaign(campaign.id);
  };

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {campaigns.map((campaign) => (
          <div key={campaign.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.campaignName}>{campaign.name}</h2>
              <span className={`${styles.status} ${styles[campaign.status]}`}>
                {campaign.status}
              </span>
            </div>
            <div className={styles.keywords}>
              {campaign.keywords.map((keyword, index) => (
                <span key={index} className={styles.keyword}>
                  {keyword}
                </span>
              ))}
            </div>
            <div className={styles.details}>
              <p><strong>Bid Amount:</strong> ${campaign.bidAmount}</p>
              <p><strong>Campaign Fund:</strong> ${campaign.campaignFund}</p>
              <p><strong>Town:</strong> {campaign.town}</p>
              <p><strong>Radius:</strong> {campaign.radius}km</p>
            </div>
            <div className={styles.actions}>
              <button
                className={`${styles.button} ${styles.editButton}`}
                onClick={() => onEdit(campaign)}
              >
                Edit
              </button>
              <button
                className={`${styles.button} ${styles.deleteButton}`}
                onClick={() => handleDelete(campaign)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 