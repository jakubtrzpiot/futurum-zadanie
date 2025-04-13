'use client';

import React, { useState, useEffect } from 'react';
import { Campaign } from '../types/campaign';
import { useCampaign } from '../context/CampaignContext';
import { useBalance } from '../context/BalanceContext';
import { mockTowns, mockKeywords } from '../data/mockData';
import styles from '../styles/CampaignForm.module.css';

interface CampaignFormProps {
  campaign?: Campaign;
  onClose: () => void;
}

export const CampaignForm: React.FC<CampaignFormProps> = ({ campaign, onClose }) => {
  const { addCampaign, updateCampaign, deleteCampaign } = useCampaign();
  const { balance, updateBalance } = useBalance();
  const [formData, setFormData] = useState<Partial<Campaign>>({
    name: '',
    keywords: [],
    bidAmount: 1,
    campaignFund: 1,
    status: 'inactive',
    town: '',
    radius: 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (campaign) {
      setFormData(campaign);
    }
  }, [campaign]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name) {
      newErrors.name = 'Campaign name is required';
    }
    
    if (!formData.keywords || formData.keywords.length === 0) {
      newErrors.keywords = 'At least one keyword is required';
    }
    
    if (!formData.bidAmount || formData.bidAmount < 1) {
      newErrors.bidAmount = 'Bid amount must be at least 1';
    }
    
    if (!formData.campaignFund || formData.campaignFund < 1) {
      newErrors.campaignFund = 'Campaign fund must be at least 1';
    }

    if (formData.campaignFund && formData.campaignFund > balance) {
      newErrors.campaignFund = 'Insufficient balance for this campaign fund';
    }
    
    if (!formData.status) {
      newErrors.status = 'Status is required';
    }
    
    if (!formData.town) {
      newErrors.town = 'Town is required';
    }
    
    if (!formData.radius || formData.radius <= 0) {
      newErrors.radius = 'Radius must be greater than 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const fundAmount = formData.campaignFund || 0;
    const isActive = formData.status === 'active';
    
    if (campaign?.id) {
      // For updates, handle balance changes based on status changes
      const oldFund = campaign.campaignFund;
      const oldStatus = campaign.status;
      const fundDifference = fundAmount - oldFund;
      
      // Handle status change from active to inactive
      if (oldStatus === 'active' && !isActive) {
        // Add back the full campaign fund when deactivating
        updateBalance(balance + oldFund);
      }
      // Handle status change from inactive to active
      else if (oldStatus === 'inactive' && isActive) {
        // Check if there's enough balance to activate
        if (fundAmount > balance) {
          setErrors({ campaignFund: 'Insufficient balance to activate this campaign' });
          return;
        }
        // Deduct the full amount when activating
        updateBalance(balance - fundAmount);
      }
      // Handle fund changes for active campaigns
      else if (isActive && fundDifference > 0) {
        // Check if there's enough balance for the increase
        if (fundDifference > balance) {
          setErrors({ campaignFund: 'Insufficient balance for this update' });
          return;
        }
        // Deduct the difference when increasing fund
        updateBalance(balance - fundDifference);
      }
      
      updateCampaign(campaign.id, formData);
    } else {
      // For new campaigns, deduct the full amount only if active
      if (isActive && fundAmount > balance) {
        setErrors({ campaignFund: 'Insufficient balance for this campaign' });
        return;
      }
      
      if (isActive) {
        updateBalance(balance - fundAmount);
      }
      
      addCampaign(formData as Omit<Campaign, 'id'>);
    }
    
    onClose();
  };

  const handleDelete = () => {
    if (campaign?.id) {
      // Add back the campaign fund to the balance if the campaign was active
      if (campaign.status === 'active') {
        updateBalance(balance + campaign.campaignFund);
      }
      
      deleteCampaign(campaign.id);
      onClose();
    }
  };

  const handleKeywordSelect = (keyword: string) => {
    if (!keyword) return;
    
    // Check if keyword already exists
    if (formData.keywords?.includes(keyword)) {
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      keywords: [...(prev.keywords || []), keyword],
    }));
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2>{campaign ? 'Edit Campaign' : 'New Campaign'}</h2>
      
      <div className={styles.formGroup}>
        <label htmlFor="name">Campaign Name</label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        {errors.name && <div className={styles.error}>{errors.name}</div>}
      </div>

      <div className={styles.formGroup}>
        <label>Keywords</label>
        <div className={styles.keywordSelector}>
          <select
            onChange={(e) => handleKeywordSelect(e.target.value)}
            value=""
          >
            <option value="">Select a keyword</option>
            {mockKeywords.map((keyword) => (
              <option key={keyword.id} value={keyword.value}>
                {keyword.value}
              </option>
            ))}
          </select>
          <div className={styles.selectedKeywords}>
            {formData.keywords?.map((keyword, index) => (
              <span key={index} className={styles.keyword}>
                {keyword}
                <button
                  type="button"
                  onClick={() => setFormData({
                    ...formData,
                    keywords: formData.keywords?.filter((_, i) => i !== index),
                  })}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
        {errors.keywords && <div className={styles.error}>{errors.keywords}</div>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="bidAmount">Bid Amount (min: 1)</label>
        <input
          type="number"
          id="bidAmount"
          min="1"
          value={formData.bidAmount}
          onChange={(e) => setFormData({ ...formData, bidAmount: Number(e.target.value) })}
          required
        />
        {errors.bidAmount && <div className={styles.error}>{errors.bidAmount}</div>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="campaignFund">Campaign Fund (min: 1)</label>
        <input
          type="number"
          id="campaignFund"
          min="1"
          value={formData.campaignFund}
          onChange={(e) => setFormData({ ...formData, campaignFund: Number(e.target.value) })}
          required
        />
        {errors.campaignFund && <div className={styles.error}>{errors.campaignFund}</div>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="status">Status</label>
        <select
          id="status"
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
          required
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        {errors.status && <div className={styles.error}>{errors.status}</div>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="town">Town</label>
        <select
          id="town"
          value={formData.town}
          onChange={(e) => setFormData({ ...formData, town: e.target.value })}
          required
        >
          <option value="">Select a town</option>
          {mockTowns.map((town) => (
            <option key={town.id} value={town.name}>
              {town.name}
            </option>
          ))}
        </select>
        {errors.town && <div className={styles.error}>{errors.town}</div>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="radius">Radius (km)</label>
        <input
          type="number"
          id="radius"
          min="0"
          value={formData.radius}
          onChange={(e) => setFormData({ ...formData, radius: Number(e.target.value) })}
          required
        />
        {errors.radius && <div className={styles.error}>{errors.radius}</div>}
      </div>

      <div className={styles.formActions}>
        <button type="submit" className={styles.submitButton}>
          {campaign ? 'Update' : 'Create'} Campaign
        </button>
        {campaign && (
          <button type="button" className={styles.deleteButton} onClick={handleDelete}>
            Delete Campaign
          </button>
        )}
        <button type="button" className={styles.cancelButton} onClick={onClose}>
          Cancel
        </button>
      </div>
    </form>
  );
};
