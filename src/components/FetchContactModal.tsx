import { useState, useEffect } from 'react';
import { Modal } from './ui/Modal';
import { Search, Users, Database, Brain, CheckCircle2, Linkedin } from 'lucide-react';

interface FetchContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (contactData: any) => void;
  companies: string[];
}

const steps = [
  {
    icon: Search,
    title: 'Web Scraping',
    description: 'Searching company websites for contact information...',
  },
  {
    icon: Linkedin,
    title: 'LinkedIn Analysis',
    description: 'Analyzing LinkedIn profiles for key personnel...',
  },
  {
    icon: Users,
    title: 'Contact Discovery',
    description: 'Identifying relevant company contacts...',
  },
  {
    icon: Database,
    title: 'Data Validation',
    description: 'Validating and structuring contact information...',
  },
  {
    icon: Brain,
    title: 'AI Processing',
    description: 'Processing and verifying contact details...',
  },
];

export function FetchContactModal({ isOpen, onClose, onComplete, companies }: FetchContactModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
      setIsComplete(false);
      simulateFetching();
    }
  }, [isOpen]);

  const simulateFetching = async () => {
    // Simulate the contact fetching process with delays
    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setCurrentStep(i + 1);
    }

    // Generate mock contact data
    const contactData = {
      name: "John Smith",
      role: "Procurement Manager",
      email: "john.smith@company.com",
      linkedIn: "https://linkedin.com/in/johnsmith"
    };

    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsComplete(true);
    onComplete(contactData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Fetching Contact Information">
      <div className="space-y-6 py-4">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = currentStep === index;
          const isCompleted = currentStep > index;

          return (
            <div
              key={index}
              className={`flex items-center space-x-4 p-4 rounded-lg transition-colors ${
                isActive ? 'bg-purple-50' : ''
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isCompleted
                    ? 'bg-green-100'
                    : isActive
                    ? 'bg-purple-100 animate-pulse'
                    : 'bg-gray-100'
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${
                    isCompleted
                      ? 'text-green-600'
                      : isActive
                      ? 'text-purple-600'
                      : 'text-gray-400'
                  }`}
                />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{step.title}</h3>
                <p className="text-sm text-gray-500">{step.description}</p>
              </div>
              {isCompleted && (
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              )}
            </div>
          );
        })}

        {isComplete && (
          <div className="flex items-center justify-center p-4 bg-green-50 rounded-lg">
            <CheckCircle2 className="w-6 h-6 text-green-500 mr-2" />
            <span className="font-medium text-green-700">
              Contact Information Retrieved!
            </span>
          </div>
        )}
      </div>
    </Modal>
  );
}