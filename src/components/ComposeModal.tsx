import { useState } from 'react';
import { Modal } from './ui/Modal';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Plus, CheckCircle2 } from 'lucide-react';
import { sendEmail } from '../lib/email';

interface ComposeModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRecipients?: { email: string; name: string }[];
  initialTemplate?: 'inbound' | 'outbound';
  onEmailSent: (newEmail: EmailType) => void;
}

export function ComposeModal({ isOpen, onClose, initialRecipients, initialTemplate, onEmailSent }: ComposeModalProps) {
  const [to, setTo] = useState(initialRecipients ? initialRecipients.map(r => r.email).join(', ') : '');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState(initialTemplate ? EMAIL_TEMPLATES[initialTemplate] : '');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSend = async () => {
    if (!to || !subject || !content) {
      setError('Please fill in all fields');
      return;
    }

    setSending(true);
    setError(null);

    try {
      const recipients = to.split(',').map(email => email.trim());
      const recipientNames = initialRecipients 
        ? initialRecipients.map(r => r.name)
        : recipients.map(email => email.split('@')[0]);

      for (let i = 0; i < recipients.length; i++) {
        const result = await sendEmail({
          to: recipients[i],
          subject,
          text: content,
          recipientName: recipientNames[i],
          leadType: initialTemplate || 'outbound'
        });

        if (!result.success) {
          throw new Error(`Failed to send email to ${recipients[i]}`);
        }

        // Only create outbound emails - inbound emails come from emailInteractions
        if (initialTemplate === 'outbound') {
          const newEmail: EmailType = {
            id: `outbound-${Date.now()}-${i}`,
            from: {
              name: 'You',
              email: 'you@nexusai.com',
            },
            to: {
              name: recipientNames[i],
              email: recipients[i],
            },
            subject,
            preview: content,
            date: new Date().toLocaleTimeString(),
            category: 'outbound',
            read: true,
            starred: false,
          };

          onEmailSent(newEmail);
        }
      }

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 2000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send email');
    } finally {
      setSending(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New Message">
      <div className="flex flex-col h-[80vh]">
        {showSuccess && (
          <div className="absolute top-0 left-0 right-0 bg-green-50 p-4 flex items-center justify-center text-green-700">
            <CheckCircle2 className="w-5 h-5 mr-2" />
            Email sent successfully!
          </div>
        )}

        <div className="p-4 border-b">
          <div className="space-y-4">
            <Input
              type="email"
              value={to}
              onChange={(e) => !initialRecipients && setTo(e.target.value)}
              placeholder="Recipients"
              error={error}
              className="border-0 px-0 focus:ring-0"
              readOnly={!!initialRecipients}
            />
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Subject"
              className="border-0 px-0 focus:ring-0"
            />
          </div>
        </div>

        <div className="flex-1 p-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-full resize-none border-0 focus:ring-0 focus:outline-none"
            placeholder="Write your message..."
          />
        </div>

        <div className="p-4 border-t flex justify-between items-center">
          <Button 
            variant="primary"
            onClick={handleSend}
            loading={sending}
            disabled={sending || showSuccess}
          >
            {sending ? 'Sending...' : 'Send'}
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
}

const EMAIL_TEMPLATES = {
  inbound: `Thank you for your interest in Nexus AI. We're excited to help you discover how our AI solutions can transform your workflow.

Please let me know if you have any specific questions about our services.

Thanks
NexusAI Team`,
  
  outbound: `I hope this email finds you well. I wanted to reach out and introduce you to Nexus AI's innovative solutions that are helping businesses like yours achieve more with AI.

Would you be interested in a quick demo to see how our tools could benefit your team?

Sincerely
Nexus AI`
};