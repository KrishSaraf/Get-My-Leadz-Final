import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCompanies } from '../context/CompanyContext';
import { CompanyCard } from '../components/CompanyCard';
import { Card } from '../components/ui/Card';
import { CustomerWorldMap } from '../components/CustomerWorldMap';
import { CustomerStats } from '../components/CustomerStats';

export function Dashboard() {
  const navigate = useNavigate();
  const { companies, loading, error } = useCompanies();

  const inboundCompanies = companies.filter(c => c.type === 'inbound');

  // Calculate total revenue
  const totalRevenue = companies.reduce((sum, company) => {
    const revenue = parseFloat(company.revenue_usd?.replace(/[^0-9.-]+/g, '') || '0');
    return sum + revenue;
  }, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5B3CC4] mb-4"></div>
          <p className="text-gray-600">Loading companies...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-6 max-w-md">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex gap-6">
        <div className="flex-1">
          <CustomerWorldMap customers={companies} />
        </div>
        <div className="w-64 space-y-4">
          <Card className="p-6">
            <p className="text-sm text-gray-600">Total Customers</p>
            <h3 className="text-2xl font-bold mt-2">{companies.length}</h3>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-gray-600">Customer Revenue</p>
            <h3 className="text-2xl font-bold mt-2">${totalRevenue.toLocaleString()}</h3>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <h2 className="text-xl font-semibold mb-4">Inbound Leads</h2>
          {inboundCompanies.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No inbound leads found</p>
          ) : (
            <div className="space-y-4">
              {inboundCompanies.map(company => (
                <CompanyCard 
                  key={company.id} 
                  company={{
                    ...company,
                    customerSince: company.created_at ? new Date(company.created_at).toLocaleDateString() : 'N/A'
                  }} 
                />
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}