import { Company } from '../types';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { ChevronDown, ChevronUp, Mail, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { Modal } from './ui/Modal';

interface CompanyCardProps {
  company: Company;
  onAction?: (action: 'send-email' | 'fetch-contact') => void;
}

export function CompanyCard({ company, onAction }: CompanyCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [showEmailWarning, setShowEmailWarning] = useState(false);

  const handleSendEmail = () => {
    if (company.email) {
      onAction?.('send-email');
    } else {
      setShowEmailWarning(true);
    }
  };

  // Get the display name based on customer type
  const displayName = company.customer_type === 'Company' ? company.company_name : company.name;

  // Get contact info based on customer type
  const contactInfo = {
    label: company.customer_type === 'Company' ? 'Contact' : 'University',
    value: company.customer_type === 'Company' ? company.name : company.company_name,
    email: company.email
  };

  // Get bottom component color based on lead type
  const bottomComponentColor = company.type === 'inbound' ? 'bg-green-100' : 'bg-yellow-100';

  return (
    <Card className="relative bg-white shadow-lg rounded-lg overflow-hidden">
      <div 
        className="p-6 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex justify-between items-start">
          <div className="space-y-4">
            <div className="text-sm text-gray-600">
              {company.customer_type || 'Unknown'} | {company.location || 'Location unknown'}
            </div>
            
            <div className="space-y-2">
              <div className="text-gray-500">Industry</div>
              <div className="text-2xl font-semibold">{displayName}</div>
            </div>
          </div>
          <button className="text-gray-400 hover:text-gray-600">
            {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>

        {expanded && (
          <div className="mt-6 space-y-4">
            <div className="space-y-1">
              <div>{contactInfo.label}: {contactInfo.value || 'Not available'}</div>
              <div>Email: {contactInfo.email || 'Not available'}</div>
            </div>

            <div className="flex space-x-4">
              <Button variant="outline" onClick={handleSendEmail}>
                Send Email
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Colored bottom component */}
      <div className={`${bottomComponentColor} p-4 flex justify-end`}>
        <ChevronRight className="w-6 h-6 text-gray-400" />
      </div>

      <Modal
        isOpen={showEmailWarning}
        onClose={() => setShowEmailWarning(false)}
        title="Contact Information Required"
      >
        <div className="space-y-4">
          <p>Please fetch contact information before sending an email.</p>
          <div className="flex justify-end">
            <Button onClick={() => setShowEmailWarning(false)}>
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </Card>
  );
}