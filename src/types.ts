import { ReactNode } from 'react';

export interface Company {
  ID: string;
  company_name: string;
  type: 'existing' | 'inbound' | 'outbound';
  location: string | null;
  name: string | null;
  email: string | null;
  role_of_contact: string | null;
  location_of_contact: string | null;
  company_description: string | null;
  revenue_usd: string | null;
  company_industry: string | null;
  customer_profile: string | null;
  subscription: string | null;
  score: string | null;
  industry_growth_rate: string | null;
  exchange_market_code: string | null;
  how_did_you_find_us: string | null;
  what_will_you_use_nexus_for: string | null;
  created_at: string | null;
  updated_at: string | null;
  showAsPotential?: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
}

export interface EmailType {
  id: string;
  from: {
    name: string;
    email: string;
    avatar?: string;
  };
  to: {
    name: string;
    email: string;
  };
  subject: string;
  preview: string;
  date: string;
  category: 'inbound' | 'outbound';
  hasAttachment?: boolean;
  attachments?: {
    name: string;
    size: string;
    type: string;
  }[];
  read?: boolean;
  starred?: boolean;
  archived?: boolean;
}

export interface EmailInteraction {
  id: string;
  from: {
    name: string;
    email: string;
  };
  to: {
    name: string;
    email: string;
  };
  subject: string;
  initialMessage: {
    content: string;
    date: string;
    time: string;
  };
  response: {
    content: string;
    date: string;
    time: string;
  };
  reply: {
    content: string;
    responseTimeHours: number;
  };
  leadScore: number;
  explanation: string;
}