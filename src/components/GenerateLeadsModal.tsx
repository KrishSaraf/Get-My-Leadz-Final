import { useState, useEffect } from 'react';
import { Modal } from './ui/Modal';
import { Search, Brain, Database, Users, CheckCircle2, Target } from 'lucide-react';

interface GenerateLeadsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const steps = [
  {
    icon: Search,
    title: 'Market Analysis',
    description: 'Analyzing market data and industry trends...',
  },
  {
    icon: Target,
    title: 'Lead Identification',
    description: 'Identifying potential companies matching your criteria...',
  },
  {
    icon: Database,
    title: 'Data Collection',
    description: 'Gathering company information and metrics...',
  },
  {
    icon: Users,
    title: 'Profile Creation',
    description: 'Creating detailed company profiles...',
  },
  {
    icon: Brain,
    title: 'AI Analysis',
    description: 'Analyzing potential fit and opportunity...',
  },
];

export function GenerateLeadsModal({ isOpen, onClose, onComplete }: GenerateLeadsModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
      setIsComplete(false);
      simulateGeneration();
    }
  }, [isOpen]);

  const simulateGeneration = async () => {
    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setCurrentStep(i + 1);
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsComplete(true);
    onComplete();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Generating New Leads">
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
              New Leads Generated Successfully!
            </span>
          </div>
        )}
      </div>
    </Modal>
  );
}