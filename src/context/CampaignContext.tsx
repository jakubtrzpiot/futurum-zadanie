import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Campaign } from '../types/campaign';
import { mockCampaigns } from '../data/mockData';

interface CampaignContextType {
  campaigns: Campaign[];
  addCampaign: (campaign: Omit<Campaign, 'id'>) => void;
  updateCampaign: (id: string, campaign: Partial<Campaign>) => void;
  deleteCampaign: (id: string) => void;
}

const CampaignContext = createContext<CampaignContextType | undefined>(undefined);

// Key for localStorage
const STORAGE_KEY = 'campaigns';

export const CampaignProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize state from localStorage or use mock data if empty
  const [campaigns, setCampaigns] = useState<Campaign[]>(() => {
    if (typeof window !== 'undefined') {
      const storedCampaigns = localStorage.getItem(STORAGE_KEY);
      if (storedCampaigns) {
        try {
          return JSON.parse(storedCampaigns);
        } catch (error) {
          console.error('Failed to parse campaigns from localStorage:', error);
          return mockCampaigns;
        }
      }
    }
    return mockCampaigns;
  });

  // Save to localStorage whenever campaigns change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(campaigns));
    }
  }, [campaigns]);

  const addCampaign = (campaign: Omit<Campaign, 'id'>) => {
    const newCampaign = {
      ...campaign,
      id: Date.now().toString(),
    };
    setCampaigns([...campaigns, newCampaign]);
  };

  const updateCampaign = (id: string, updatedCampaign: Partial<Campaign>) => {
    setCampaigns(
      campaigns.map((campaign) =>
        campaign.id === id ? { ...campaign, ...updatedCampaign } : campaign
      )
    );
  };

  const deleteCampaign = (id: string) => {
    setCampaigns(campaigns.filter((campaign) => campaign.id !== id));
  };

  return (
    <CampaignContext.Provider
      value={{ campaigns, addCampaign, updateCampaign, deleteCampaign }}
    >
      {children}
    </CampaignContext.Provider>
  );
};

export const useCampaign = () => {
  const context = useContext(CampaignContext);
  if (context === undefined) {
    throw new Error('useCampaign must be used within a CampaignProvider');
  }
  return context;
}; 