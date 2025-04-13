export interface Campaign {
  id: string;
  name: string;
  keywords: string[];
  bidAmount: number;
  campaignFund: number;
  status: 'active' | 'inactive';
  town: string;
  radius: number;
}

export interface Town {
  id: string;
  name: string;
}

export interface Keyword {
  id: string;
  value: string;
}
