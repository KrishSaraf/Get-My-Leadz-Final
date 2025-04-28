import { useState, useEffect } from 'react';
import { Modal } from './ui/Modal';
import { Brain, Clock, MessageSquare, BarChart as ChartBar, CheckCircle2 } from 'lucide-react';

interface ScoreAnalysisModalProps {
  isOpen: boolean;
  onComplete: () => void;
  selectedEmails: any[];
}

const steps = [
  {
    icon: Brain,
    title: 'AI Analysis',
    description: 'Analyzing email content and context...',
  },
  {
    icon: Clock,
    title: 'Response Time Analysis',
    description: 'Calculating response patterns and engagement...',
  },
  {
    icon: MessageSquare,
    title: 'Sentiment Analysis',
    description: 'Evaluating message tone and intent...',
  },
  {
    icon: ChartBar,
    title: 'Score Generation',
    description: 'Generating comprehensive lead score...',
  },
];

export function ScoreAnalysisModal({ isOpen, onComplete, selectedEmails }: ScoreAnalysisModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
      setIsComplete(false);
      simulateAnalysis();
    }
  }, [isOpen]);

  const simulateAnalysis = async () => {
    // Each step takes 1.5 seconds (6 seconds total for 4 steps)
    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setCurrentStep(i + 1);
    }

    // Store scored interactions in localStorage
    const existingScored = JSON.parse(localStorage.getItem('scoredInteractions') || '[]');
    const newScored = selectedEmails.filter(email => !existingScored.find((e: any) => e.id === email.id));
    localStorage.setItem('scoredInteractions', JSON.stringify([...existingScored, ...newScored]));

    setIsComplete(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    onComplete();
  };

  return (
    <Modal isOpen={isOpen} onClose={() => {}} title="Analyzing Responses">
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
              Analysis Complete!
            </span>
          </div>
        )}
      </div>
    </Modal>
  );
}