import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCompanies } from '../context/CompanyContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Search, CheckCircle2 } from 'lucide-react';
import { CustomerWorldMap } from '../components/CustomerWorldMap';
import { CustomerRevenueSlideshow } from '../components/CustomerRevenueSlideshow';
import { CustomerGrowthChart } from '../components/CustomerGrowthChart';

type CustomerType = 'all' | 'company' | 'individual';

export function Customers() {
  const navigate = useNavigate();
  const { companies, loading } = useCompanies();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [selectedType, setSelectedType] = useState<CustomerType>('all');

  const existingCustomers = companies?.filter(c => c.type === 'existing') || [];
  
  const filteredCustomers = existingCustomers.filter(customer => {
    if (selectedType !== 'all') {
      if (selectedType === 'company' && customer.customer_type !== 'Company') return false;
      if (selectedType === 'individual' && customer.customer_type !== 'Individual') return false;
    }
    
    if (!searchQuery) return true;
    
    const searchLower = searchQuery.toLowerCase();
    return (
      (customer.company_name?.toLowerCase().includes(searchLower) ||
      customer.name?.toLowerCase().includes(searchLower) ||
      customer.location?.toLowerCase().includes(searchLower) ||
      customer.company_industry?.toLowerCase().includes(searchLower))
    );
  });

  const handleSearch = () => {
    setIsSearching(true);
    setTimeout(() => setIsSearching(false), 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5B3CC4] mb-4"></div>
          <p className="text-gray-600">Loading customers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex gap-6">
        <div className="flex-1">
          <CustomerWorldMap customers={filteredCustomers} />
        </div>
        <div className="w-64 space-y-4">
          <CustomerGrowthChart customers={filteredCustomers} />
          <Card>
            <CustomerRevenueSlideshow companies={filteredCustomers} />
          </Card>
        </div>
      </div>

      <div className="space-y-4">
        <div className="relative flex-1">
          <button 
            onClick={handleSearch}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Search className={`w-5 h-5 ${isSearching ? 'animate-pulse' : ''}`} />
          </button>
          <input
            type="text"
            placeholder="Search customers by name or location..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B3CC4] focus:border-transparent text-base"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>

        <div className="flex space-x-4">
          <Button
            variant={selectedType === 'all' ? 'primary' : 'outline'}
            onClick={() => setSelectedType('all')}
          >
            All
          </Button>
          <Button
            variant={selectedType === 'company' ? 'primary' : 'outline'}
            onClick={() => setSelectedType('company')}
          >
            Companies
          </Button>
          <Button
            variant={selectedType === 'individual' ? 'primary' : 'outline'}
            onClick={() => setSelectedType('individual')}
          >
            Individuals
          </Button>
        </div>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left p-4 font-medium text-gray-500">Customer</th>
                <th className="text-left p-4 font-medium text-gray-500">Location</th>
                <th className="text-left p-4 font-medium text-gray-500">Customer Since</th>
                <th className="text-left p-4 font-medium text-gray-500">Monthly Subscription Value</th>
                <th className="text-left p-4 font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-500">
                    {searchQuery ? 'No customers found matching your search' : 'No customers found'}
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr 
                    key={customer.id} 
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="p-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-[#5B3CC4] rounded-full flex items-center justify-center text-white">
                          {(customer.customer_type === 'Company' ? customer.company_name : customer.name)?.[0] || 'C'}
                        </div>
                        <span className="ml-3 font-medium">
                          {customer.customer_type === 'Company' ? customer.company_name : customer.name}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600">{customer.location || '-'}</td>
                    <td className="p-4 text-gray-600">{customer.created_at || '-'}</td>
                    <td className="p-4 text-gray-600">${customer.subscription || '-'}</td>
                    <td className="p-4">
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}