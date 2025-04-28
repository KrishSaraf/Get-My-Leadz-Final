import { useState } from 'react';
import { X, Mail, Phone, Pencil, Trash2, Check, Users, Building2, MapPin, Users2 } from 'lucide-react';
import { Button } from './ui/Button';
import { Modal } from './ui/Modal';
import { useCompanies } from '../context/CompanyContext';
import { FetchContactModal } from './FetchContactModal';

interface LeadPreviewProps {
  lead: any;
  onClose: () => void;
  onSendEmail: () => void;
}

export function LeadPreview({ lead, onClose, onSendEmail }: LeadPreviewProps) {
  const { fetchContactInfo } = useCompanies();
  const [showFetchContactModal, setShowFetchContactModal] = useState(false);
  const [showEmailWarning, setShowEmailWarning] = useState(false);

  const handleFetchContact = () => {
    setShowFetchContactModal(true);
  };

  const handleFetchContactComplete = async () => {
    await fetchContactInfo([lead.id]);
    setShowFetchContactModal(false);
  };

  const handleSendEmail = () => {
    if (!lead.email) {
      setShowEmailWarning(true);
      return;
    }
    onSendEmail();
  };

  return (
    <div className="fixed inset-y-0 right-0 w-[600px] bg-[#f3f7ff] shadow-xl overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-[#f3f7ff] z-10 border-b border-gray-200">
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center space-x-4">
            <img 
              src={lead.logo || `https://ui-avatars.com/api/?name=${lead.company_name}&background=5B3CC4&color=fff`}
              alt={lead.company_name}
              className="w-16 h-16 rounded-lg"
            />
            <div>
              <h1 className="text-2xl font-semibold">{lead.company_name}</h1>
              <div className="flex items-center space-x-2 mt-1 text-gray-600">
                <Building2 className="w-4 h-4" />
                <span>{lead.company_industry}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Quick stats */}
        <div className="px-6 pb-6 grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2 text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>{lead.location}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <Users2 className="w-4 h-4" />
            <span>{lead.customer_type}</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="px-6 pb-6 flex space-x-4">
          <Button className="flex-1" onClick={handleSendEmail}>
            <Mail className="w-4 h-4 mr-2" />
            Send Email
          </Button>
          {!lead.email && lead.type === 'outbound' && (
            <Button className="flex-1" onClick={handleFetchContact}>
              <Users className="w-4 h-4 mr-2" />
              Fetch Contact
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-8 bg-white mx-6 my-6 rounded-lg">
        <section>
          <h2 className="text-lg font-semibold mb-4">About</h2>
          <p className="text-gray-600 whitespace-pre-line">
            {lead.company_description || 'No description available.'}
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-500">Name</label>
              <p className="font-medium">{lead.name || 'Not available'}</p>
            </div>
            {/* <div>
              <label className="text-sm text-gray-500">Why Are We Suggesting This?</label>
              <p className="font-medium">{lead.explanation || 'Not available'}</p>
            </div> */}
            <div>
              <label className="text-sm text-gray-500">Email</label>
              <p className="font-medium">{lead.email || 'Not available'}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Role</label>
              <p className="font-medium">{lead.role_of_contact || 'Not available'}</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-4">Why is it a Potential Lead?</h2>
          <p className="text-gray-600">{lead.explanation || 'Not available'}</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-4">Company Details</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-500">Revenue (USD)</label>
              <p className="font-medium">{lead.revenue_usd || 'Not available'}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Customer Profile</label>
              <p className="font-medium">{lead.customer_profile || 'Not available'}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Industry Growth Rate</label>
              <p className="font-medium">{lead.industry_growth_rate || 'Not available'}</p>
            </div>
          </div>
        </section>

        {lead.type === 'inbound' && (
          <section>
            <h2 className="text-lg font-semibold mb-4">Inquiry Details</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-500">How did you find us</label>
                <p className="font-medium">{lead.how_did_you_find_us || 'Not specified'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">What will you use us for</label>
                <p className="font-medium">{lead.what_will_you_use_nexus_for || 'Not specified'}</p>
              </div>
            </div>
          </section>
        )}
      </div>

      <Modal
        isOpen={showEmailWarning}
        onClose={() => setShowEmailWarning(false)}
        title="Contact Information Required"
      >
        <div className="space-y-4">
          <p>Please fetch contact information before sending an email.</p>
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setShowEmailWarning(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              setShowEmailWarning(false);
              handleFetchContact();
            }}>
              Fetch Contact
            </Button>
          </div>
        </div>
      </Modal>

      <FetchContactModal
        isOpen={showFetchContactModal}
        onClose={() => setShowFetchContactModal(false)}
        onComplete={handleFetchContactComplete}
        companies={[lead.id]}
      />
    </div>
  );
}
