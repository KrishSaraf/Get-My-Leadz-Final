import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCompanies } from '../context/CompanyContext';
import { CompanyCard } from '../components/CompanyCard';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { LayoutGrid, List, Mail, ChevronRight, ArrowUpDown, Search } from 'lucide-react';
import { GenerateLeadsModal } from '../components/GenerateLeadsModal';
import { LeadPreview } from '../components/LeadPreview';

type LeadTab = 'all' | 'inbound' | 'potential';
type ViewMode = 'grid' | 'list';
type SortDirection = 'asc' | 'desc';

function LeadListItem({ company, isSelected, onSelect, onClick }: {
  company: Company;
  isSelected: boolean;
  onSelect: (e: React.MouseEvent) => void;
  onClick: () => void;
}) {
  const indicatorColor = company.type === 'inbound' ? 'bg-green-100' : 'bg-yellow-100';
  
  const displayName = company.customer_type === 'Individual' ? company.name : company.company_name;
  
  return (
    <tr 
      className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer relative"
      onClick={onClick}
    >
      <td className="w-[4px] p-0">
        <div className={`${indicatorColor} h-full`} />
      </td>
      <td className="py-4 px-6">
        <div className="flex items-center space-x-4">
          <div 
            onClick={onSelect}
            className={`w-4 h-4 rounded ${
              company.type === 'inbound'
                ? isSelected ? 'bg-green-500' : 'bg-green-200'
                : isSelected ? 'bg-yellow-500' : 'bg-yellow-200'
            }`}
          />
          <div className="font-medium">{displayName}</div>
        </div>
      </td>
      <td className="py-4 px-6">
        <div className="text-sm">{company.company_industry}</div>
      </td>
      <td className="py-4 px-6">
        <div className="text-sm">{company.customer_type}</div>
      </td>
      <td className="py-4 px-6">
        <div className="text-sm">{company.location}</div>
      </td>
      <td className="py-4 px-6">
        <div className="text-sm">
          {company.customer_type === 'Individual' ? company.company_name : company.name}
        </div>
      </td>
      <td className="py-4 px-6">
        <div className="text-sm">{company.email}</div>
      </td>
      <td className="py-4 pr-2 pl-0">
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </td>
    </tr>
  );
}

export function Leads() {
  const navigate = useNavigate();
  const { companies, loading, generateNewLeads } = useCompanies();
  const [selectedTab, setSelectedTab] = useState<LeadTab>('potential');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set());
  const [showGenerateLeadsModal, setShowGenerateLeadsModal] = useState(false);
  const [showEmailWarning, setShowEmailWarning] = useState(false);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [searchQuery, setSearchQuery] = useState('');

  const inboundCompanies = companies.filter(c => c.type?.toLowerCase() === 'inbound');
  const potentialCompanies = companies.filter(c => 
    c.type?.toLowerCase() === 'show' && c.showAsPotential
  );

  const displayedCompanies = [...(selectedTab === 'all'
    ? [...inboundCompanies, ...potentialCompanies]
    : selectedTab === 'inbound'
    ? inboundCompanies
    : potentialCompanies)]
    .filter(company => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        company.company_name?.toLowerCase().includes(query) ||
        company.location?.toLowerCase().includes(query)
      );
    })
    .sort((a, b) => {
      const nameA = a.company_name?.toLowerCase() || '';
      const nameB = b.company_name?.toLowerCase() || '';
      return sortDirection === 'asc' 
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    });

  const selectedCompanies = Array.from(selectedLeads)
    .map(id => companies.find(c => c.id === id))
    .filter(Boolean);

  const handleGenerateLeads = () => {
    setShowGenerateLeadsModal(true);
  };

  const handleGenerateLeadsComplete = async () => {
    try {
      await generateNewLeads();
      setSelectedTab('potential');
    } finally {
      setShowGenerateLeadsModal(false);
    }
  };

  const toggleLeadSelection = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const newSelected = new Set(selectedLeads);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedLeads(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedLeads.size === displayedCompanies.length) {
      setSelectedLeads(new Set());
    } else {
      setSelectedLeads(new Set(displayedCompanies.map(c => c.id)));
    }
  };

  const handleSendEmail = () => {
    const missingEmails = selectedCompanies.some(company => !company?.email);
    if (missingEmails) {
      setShowEmailWarning(true);
      return;
    }

    const emailType = selectedCompanies[0]?.type as 'inbound' | 'show';

    navigate('/email', {
      state: {
        recipients: selectedCompanies.map(company => ({
          email: company.email,
          name: company.name || company.company_name
        })),
        template: emailType
      }
    });
  };

  const toggleSelectionMode = () => {
    setIsSelecting(!isSelecting);
    if (!isSelecting) {
      setSelectedLeads(new Set());
    }
  };

  const toggleSortDirection = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const renderEmptyState = () => (
    <Card className="p-8 text-center">
      <div className="max-w-md mx-auto">
        <h3 className="text-xl font-semibold mb-2">No Leads Found</h3>
        <p className="text-gray-600 mb-6">
          {selectedTab === 'potential'
            ? "Start discovering potential customers for your business by generating new leads."
            : selectedTab === 'inbound'
            ? "No inbound leads yet. They will appear here when customers show interest."
            : "Start by generating leads or wait for inbound inquiries."}
        </p>
        {selectedTab === 'potential' && (
          <Button onClick={handleGenerateLeads}>
            Generate New Leads
          </Button>
        )}
      </div>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5B3CC4] mb-4"></div>
          <p className="text-gray-600">Loading leads...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
          <span className="text-sm text-gray-500">({displayedCompanies.length})</span>
        </div>
        <Button onClick={handleGenerateLeads}>
          Generate New Leads
        </Button>
      </div>

      <div className="border-b border-gray-200">
        <div className="flex items-center justify-between">
          <nav className="-mb-px flex items-center space-x-8">
            <button
              onClick={() => setSelectedTab('all')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                selectedTab === 'all'
                  ? 'border-[#5B3CC4] text-[#5B3CC4]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              All Leads
            </button>
            <button
              onClick={() => setSelectedTab('inbound')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                selectedTab === 'inbound'
                  ? 'border-[#5B3CC4] text-[#5B3CC4]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Inbound
            </button>
            <button
              onClick={() => setSelectedTab('potential')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                selectedTab === 'potential'
                  ? 'border-[#5B3CC4] text-[#5B3CC4]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Potential
            </button>
          </nav>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-[300px] border rounded-full focus:outline-none focus:ring-2 focus:ring-[#5B3CC4] focus:border-transparent"
                />
              </div>
              <Button
                variant="outline"
                onClick={toggleSortDirection}
                className="flex items-center space-x-2"
              >
                <ArrowUpDown className="w-4 h-4" />
                <span>Sort {sortDirection === 'asc' ? 'A-Z' : 'Z-A'}</span>
              </Button>
              {!isSelecting && (
                <div className="flex items-center border rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                  >
                    <LayoutGrid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
            {isSelecting ? (
              <div className="flex items-center space-x-4">
                <Button variant="outline" onClick={handleSelectAll}>
                  {selectedLeads.size === displayedCompanies.length ? 'Deselect All' : 'Select All'}
                </Button>
                <Button onClick={handleSendEmail} disabled={selectedLeads.size === 0}>
                  <Mail className="w-5 h-5 mr-2" />
                  Send Email ({selectedLeads.size})
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsSelecting(false);
                    setSelectedLeads(new Set());
                  }}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <Button variant="outline" onClick={toggleSelectionMode}>
                Select
              </Button>
            )}
          </div>
        </div>
      </div>

      {displayedCompanies.length === 0 ? (
        renderEmptyState()
      ) : viewMode === 'list' ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="w-[4px] p-0"></th>
                <th className="text-left py-4 px-6 font-medium text-gray-500">Lead</th>
                <th className="text-left py-4 px-6 font-medium text-gray-500">Industry</th>
                <th className="text-left py-4 px-6 font-medium text-gray-500">Customer Type</th>
                <th className="text-left py-4 px-6 font-medium text-gray-500">Location</th>
                <th className="text-left py-4 px-6 font-medium text-gray-500">Contact</th>
                <th className="text-left py-4 px-6 font-medium text-gray-500">Email Address</th>
                <th className="w-12 py-4 px-6"></th>
              </tr>
            </thead>
            <tbody>
              {displayedCompanies.map(company => (
                <LeadListItem
                  key={company.id}
                  company={company}
                  isSelected={selectedLeads.has(company.id)}
                  onSelect={(e) => toggleLeadSelection(e, company.id)}
                  onClick={() => setSelectedLead(company)}
                />
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-6">
          {displayedCompanies.map(company => (
            <div
              key={company.id}
              className={`relative transition-all duration-200 ${
                isSelecting && selectedLeads.has(company.id)
                  ? 'ring-2 ring-[#5B3CC4] ring-offset-2 rounded-lg'
                  : ''
              }`}
              onClick={(e) => isSelecting ? toggleLeadSelection(e, company.id) : setSelectedLead(company)}
            >
              <CompanyCard
                company={company}
                onAction={(action) => {
                  if (action === 'add-to-crm') {
                    navigate('/crm');
                  } else if (action === 'send-email') {
                    if (!company.email) {
                      setSelectedLeads(new Set([company.id]));
                      setShowEmailWarning(true);
                      return;
                    }
                    navigate('/email', {
                      state: {
                        recipients: [{
                          email: company.email,
                          name: company.name || company.company_name
                        }],
                        template: company.type
                      }
                    });
                  }
                }}
              />
            </div>
          ))}
        </div>
      )}

      {selectedLead && !isSelecting && (
        <LeadPreview
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onSendEmail={() => {
            if (!selectedLead.email) {
              setShowEmailWarning(true);
              return;
            }
            navigate('/email', {
              state: {
                recipients: [{
                  email: selectedLead.email,
                  name: selectedLead.name || selectedLead.company_name
                }],
                template: selectedLead.type
              }
            });
          }}
          onAddToCRM={() => {
            navigate('/crm');
          }}
        />
      )}

      <Modal
        isOpen={showEmailWarning}
        onClose={() => setShowEmailWarning(false)}
        title="Contact Information Required"
      >
        <div className="space-y-4">
          <p>Please fetch contact information before sending an email.</p>
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setShowEmailWarning(false)}>
              Close
            </Button>
          </div>
        </div>
      </Modal>

      <GenerateLeadsModal
        isOpen={showGenerateLeadsModal}
        onClose={() => setShowGenerateLeadsModal(false)}
        onComplete={handleGenerateLeadsComplete}
      />
    </div>
  );
}