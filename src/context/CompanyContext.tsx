import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Company } from '../types';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

interface CompanyContextType {
  companies: Company[];
  loading: boolean;
  error: string | null;
  fetchCompanies: () => Promise<void>;
  addCompany: (company: Partial<Company>) => Promise<void>;
  updateCompany: (id: string, company: Partial<Company>) => Promise<void>;
  deleteCompany: (id: string) => Promise<void>;
  generateNewLeads: () => Promise<void>;
  fetchContactInfo: (ids: string[]) => Promise<void>;
  verifyCompanies: (ids: string[]) => Promise<void>;
  userWowValue: number | null;
}

const CompanyContext = createContext<CompanyContextType | null>(null);

export function CompanyProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userWowValue, setUserWowValue] = useState<number | null>(null);

  const fetchUserWowValue = async () => {
    if (!user) return;

    try {
      const { data, error: wowError } = await supabase
        .from('auth_users')
        .select('wow')
        .eq('id', user.id)
        .single();

      if (wowError) throw wowError;
      if (data) {
        setUserWowValue(data.wow);
      }
    } catch (err) {
      console.error('Error fetching user wow value:', err);
    }
  };

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('final_list_duplicate')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      // Filter potential leads based on user's wow value
      const processedData = (data || []).map(company => {
        const isOutbound = company.type?.toLowerCase() === 'show';
        const wowColumnValue = userWowValue ? company[userWowValue.toString()] : null;
        
        return {
          ...company,
          type: company.type?.toLowerCase() as 'existing' | 'inbound' | 'show',
          // Only show outbound leads where the user's wow column value is 1
          showAsPotential: isOutbound && wowColumnValue === 1
        };
      });

      setCompanies(processedData);
    } catch (err) {
      console.error('Error fetching companies:', err);
      setError('Failed to fetch companies');
    } finally {
      setLoading(false);
    }
  };

  const generateNewLeads = async () => {
    if (!userWowValue) return;

    try {
      setLoading(true);
      setError(null);

      // Get 10 random outbound leads where the user's wow column is 0
      const { data: newLeads, error: fetchError } = await supabase
  .from('final_list_duplicate')
  .select('*')
  .eq('type', 'show')
  .eq(userWowValue.toString(), 0)
  .limit(10);

      if (fetchError) throw fetchError;

      if (!newLeads || newLeads.length === 0) {
        setError('No new leads available');
        return;
      }

      // Update the user's wow column to 1 for these leads
      const { error: updateError } = await supabase
        .from('final_list_duplicate')
        .update({ [userWowValue.toString()]: 1 })
        .in('id', newLeads.map(lead => lead.id));

      if (updateError) throw updateError;

      // Fetch all companies again to ensure we have the latest data
      await fetchCompanies();

    } catch (err) {
      console.error('Error generating leads:', err);
      setError('Failed to generate leads');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addCompany = async (company: Partial<Company>) => {
    try {
      setLoading(true);
      setError(null);

      const processedCompany = {
        ...company,
        type: company.type?.toLowerCase() as 'existing' | 'inbound' | 'show',
        [userWowValue?.toString() || '1']: company.type?.toLowerCase() === 'show' ? 0 : null
      };

      const { data, error: insertError } = await supabase
        .from('final_list_duplicate')
        .insert([processedCompany])
        .select()
        .single();

      if (insertError) throw insertError;

      setCompanies(prev => [data as Company, ...prev]);
    } catch (err) {
      console.error('Error adding company:', err);
      setError('Failed to add company');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateCompany = async (id: string, company: Partial<Company>) => {
    try {
      setLoading(true);
      setError(null);

      const processedCompany = {
        ...company,
        type: company.type?.toLowerCase() as 'existing' | 'inbound' | 'show'
      };

      const { error: updateError } = await supabase
        .from('final_list_duplicate')
        .update(processedCompany)
        .eq('id', id);

      if (updateError) throw updateError;

      setCompanies(prev =>
        prev.map(c => (c.id === id ? { ...c, ...processedCompany } : c))
      );
    } catch (err) {
      console.error('Error updating company:', err);
      setError('Failed to update company');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteCompany = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const { error: deleteError } = await supabase
        .from('final_list_duplicate')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      setCompanies(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      console.error('Error deleting company:', err);
      setError('Failed to delete company');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchContactInfo = async (ids: string[]) => {
    // Mock implementation - in a real app, this would call an API
    await new Promise(resolve => setTimeout(resolve, 2000));
  };

  const verifyCompanies = async (ids: string[]) => {
    // Mock implementation - in a real app, this would call an API
    await new Promise(resolve => setTimeout(resolve, 2000));
  };

  useEffect(() => {
    if (user) {
      fetchUserWowValue();
    }
  }, [user]);

  useEffect(() => {
    if (userWowValue !== null) {
      fetchCompanies();
    }
  }, [userWowValue]);

  return (
    <CompanyContext.Provider
      value={{
        companies,
        loading,
        error,
        fetchCompanies,
        addCompany,
        updateCompany,
        deleteCompany,
        generateNewLeads,
        fetchContactInfo,
        verifyCompanies,
        userWowValue,
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
}

export function useCompanies() {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error('useCompanies must be used within a CompanyProvider');
  }
  return context;
}