import { useState, useEffect } from 'react';
import { Modal } from './ui/Modal';
import { Search, Globe, Database, Brain, CheckCircle2 } from 'lucide-react';

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (verificationData: any) => void;
  companies: string[];
}

const steps = [
  {
    icon: Search,
    title: 'Web Scraping',
    description: 'Searching the web for company information...',
  },
  {
    icon: Globe,
    title: 'Data Collection',
    description: 'Collecting public company data...',
  },
  {
    icon: Database,
    title: 'Information Processing',
    description: 'Processing and structuring company information...',
  },
  {
    icon: Brain,
    title: 'AI Analysis',
    description: 'Analyzing and verifying collected data...',
  },
];

export function VerificationModal({ isOpen, onClose, onComplete, companies }: VerificationModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
      setIsComplete(false);
      simulateVerification();
    }
  }, [isOpen]);

  const simulateVerification = async () => {
    // Simulate the verification process with delays
    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setCurrentStep(i + 1);
    }

    // Generate mock verification data
    const verificationData = companies.map(company => ({
      "Country of Listing/Incorporation": "Private",
      "Description": "Leading provider of innovative solutions",
      "Revenue (Fiscal Year)": "$XXX,XXX,XXX",
      "Net Income (Fiscal Year)": "$XX,XXX,XXX",
      "Industry": "Technology",
      "Customer Profile": "Enterprise businesses",
      "Public Sentiment Recently": "Positive",
      "Industry Growth Rate": "12.5%",
      "Company Exchange Code if Listed": "XXXX",
    }));

    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsComplete(true);
    onComplete(verificationData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Verifying Companies">
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
              Verification Complete!
            </span>
          </div>
        )}
      </div>
    </Modal>
  );
}