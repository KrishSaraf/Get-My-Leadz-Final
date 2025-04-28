import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Search, 
  MoreHorizontal,
  Trash2,
  Archive,
  X,
  CheckCircle2
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { ComposeModal } from '../components/ComposeModal';
import { ScoreAnalysisModal } from '../components/ScoreAnalysisModal';
import { EmailType } from '../types';
import { emailInteractions } from '../data/emailList';

export function EmailPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState<'inbound' | 'outbound'>('inbound');
  const [searchQuery, setSearchQuery] = useState('');
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [showScoreAnalysisModal, setShowScoreAnalysisModal] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<any>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedEmails, setSelectedEmails] = useState<Set<string>>(new Set());
  const [emails, setEmails] = useState<EmailType[]>([]);
  const [emailsToScore, setEmailsToScore] = useState<any[]>([]);

  const { recipients, template } = location.state || {};

  const handleEmailSent = (newEmail: EmailType) => {
    const updatedEmails = [newEmail, ...emails];
    setEmails(updatedEmails);
    localStorage.setItem(
      'outboundEmails',
      JSON.stringify(updatedEmails.filter(email => email.category === 'outbound'))
    );
    setShowComposeModal(false);
  };

  useEffect(() => {
    if (recipients && template) {
      setShowComposeModal(true);
      setSelectedTab(template);
    }
  }, [recipients, template]);

  useEffect(() => {
    const inboundEmails = emailInteractions.map(interaction => ({
      id: interaction.id,
      from: {
        name: interaction.from.name,
        email: interaction.from.email,
      },
      to: {
        name: interaction.to.name,
        email: interaction.to.email,
      },
      subject: interaction.subject,
      preview: interaction.initialMessage.content,
      date: `${interaction.initialMessage.date} ${interaction.initialMessage.time}`,
      category: 'inbound' as const,
      read: false,
      starred: false,
      fullThread: {
        initial: interaction.initialMessage,
        response: interaction.response,
        reply: interaction.reply
      }
    }));

    const storedOutboundEmails = JSON.parse(localStorage.getItem('outboundEmails') || '[]');
    setEmails([...storedOutboundEmails, ...inboundEmails]);
  }, []);

  const filteredEmails = emails.filter(email => {
    const matchesTab = email.category === selectedTab;
    const matchesSearch = !searchQuery ||
      email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.from.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.preview.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const toggleEmailSelection = (id: string) => {
    if (!isSelecting) return;

    const newSelected = new Set(selectedEmails);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedEmails(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedEmails.size === filteredEmails.length) {
      setSelectedEmails(new Set());
    } else {
      setSelectedEmails(new Set(filteredEmails.map(e => e.id)));
    }
  };

  const handleScore = () => {
    // Find the full interaction data for selected emails
    const selectedInteractions = emailInteractions.filter(interaction =>
      selectedEmails.has(interaction.id)
    );
    setEmailsToScore(selectedInteractions);
    setShowScoreAnalysisModal(true);
  };

  const handleScoreAnalysisComplete = () => {
    setShowScoreAnalysisModal(false);
    setIsSelecting(false);
    setSelectedEmails(new Set());
    navigate('/company-scorer');
  };

  const formatDateTime = (date: string, time: string) => {
    return `${date} at ${time}`;
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-white">
      {/* Top Bar */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-8">
          <button
            onClick={() => setSelectedTab('inbound')}
            className={`text-sm font-medium pb-4 border-b-2 -mb-4 ${
              selectedTab === 'inbound'
                ? 'text-[#5B3CC4] border-[#5B3CC4]'
                : 'text-gray-500 border-transparent'
            }`}
          >
            Inbound
          </button>
          <button
            onClick={() => setSelectedTab('outbound')}
            className={`text-sm font-medium pb-4 border-b-2 -mb-4 ${
              selectedTab === 'outbound'
                ? 'text-[#5B3CC4] border-[#5B3CC4]'
                : 'text-gray-500 border-transparent'
            }`}
          >
            Outbound
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search emails"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-[300px] border rounded-full focus:outline-none focus:ring-2 focus:ring-[#5B3CC4] focus:border-transparent"
            />
          </div>
          {selectedTab === 'inbound' && !isSelecting && (
            <Button variant="outline" onClick={() => setIsSelecting(true)}>
              Select
            </Button>
          )}
          {isSelecting && (
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={handleSelectAll}>
                {selectedEmails.size === filteredEmails.length ? 'Deselect All' : 'Select All'}
              </Button>
              <Button
                variant="primary"
                disabled={selectedEmails.size === 0}
                onClick={handleScore}
              >
                Score ({selectedEmails.size})
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsSelecting(false);
                  setSelectedEmails(new Set());
                }}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Disclaimer to stand out */}
      <div className="p-4 bg-[#f2ecff] border-l-4 border-[#5B3CC4] text-[#5B3CC4] text-sm font-semibold">
        As shown in the Demo, all the 6 email conversations for the Inbound leads
        have been completed as seen here. Please proceed to score.
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Email List */}
        <div className="w-[400px] overflow-auto border-r">
          {filteredEmails.map(email => (
            <div
              key={email.id}
              onClick={() => (isSelecting ? toggleEmailSelection(email.id) : setSelectedEmail(email))}
              className={`flex items-start p-4 border-b hover:bg-gray-50 cursor-pointer ${
                !email.read ? 'bg-blue-50' : ''
              } ${selectedEmail?.id === email.id ? 'bg-gray-100' : ''} ${
                selectedEmails.has(email.id) ? 'bg-purple-50' : ''
              }`}
            >
              <div className="flex-shrink-0 mr-4">
                {isSelecting ? (
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedEmails.has(email.id)
                        ? 'border-[#5B3CC4] bg-[#5B3CC4] text-white'
                        : 'border-gray-300'
                    }`}
                  >
                    {selectedEmails.has(email.id) && <CheckCircle2 className="w-4 h-4" />}
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#5B3CC4] text-white flex items-center justify-center text-lg font-medium">
                    {email.category === 'outbound' ? email.to.name[0] : email.from.name[0]}
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">
                      {email.category === 'outbound' ? email.to.name : email.from.name}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">{email.date}</span>
                </div>

                <h3 className="text-base font-medium mt-1">{email.subject}</h3>
                <p className="text-sm text-gray-600 mt-1 truncate">{email.preview}</p>
              </div>
            </div>
          ))}

          {filteredEmails.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <p className="text-lg">No emails found</p>
              <p className="text-sm mt-2">Try adjusting your search or filters</p>
            </div>
          )}
        </div>

        {/* Email Preview */}
        {selectedEmail ? (
          <div className="flex-1 overflow-auto bg-white">
            <div className="p-8">
              <div className="max-w-3xl mx-auto">
                <div className="flex justify-between items-start mb-8">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-[#5B3CC4] text-white flex items-center justify-center text-xl">
                      {selectedEmail.category === 'outbound'
                        ? selectedEmail.to.name[0]
                        : selectedEmail.from.name[0]}
                    </div>
                    <div>
                      <h2 className="text-2xl font-semibold mb-1">
                        {selectedEmail.subject}
                      </h2>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <span className="font-medium">
                          {selectedEmail.category === 'outbound'
                            ? selectedEmail.to.name
                            : selectedEmail.from.name}
                        </span>
                        <span>•</span>
                        <span>{selectedEmail.date}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedEmail(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-8">
                  {/* Email Content */}
                  <div className="bg-white rounded-lg">
                    <div className="prose max-w-none text-gray-800 text-base leading-relaxed">
                      {selectedEmail.preview
                        .split('\n')
                        .map((paragraph: string, index: number) => (
                          <p key={index} className="mb-4">
                            {paragraph}
                          </p>
                        ))}
                    </div>
                  </div>

                  {selectedEmail.fullThread && (
                    <>
                      {/* Response */}
                      <div className="border-t pt-8">
                        <div className="flex items-center space-x-4 mb-4">
                          <div className="w-10 h-10 rounded-full bg-[#5B3CC4] text-white flex items-center justify-center text-lg">
                            N
                          </div>
                          <div>
                            <div className="font-medium">NexusAI Team</div>
                            <div className="text-sm text-gray-500">
                              {formatDateTime(
                                selectedEmail.fullThread.response.date,
                                selectedEmail.fullThread.response.time
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="prose max-w-none text-gray-800 text-base leading-relaxed">
                          {selectedEmail.fullThread.response.content
                            .split('\n')
                            .map((paragraph: string, index: number) => (
                              <p key={index} className="mb-4">
                                {paragraph}
                              </p>
                            ))}
                        </div>
                      </div>

                      {/* Reply */}
                      <div className="border-t pt-8">
                        <div className="flex items-center space-x-4 mb-4">
                          <div className="w-10 h-10 rounded-full bg-[#5B3CC4] text-white flex items-center justify-center text-lg">
                            {selectedEmail.from.name[0]}
                          </div>
                          <div>
                            <div className="font-medium">
                              {selectedEmail.from.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              Response time:{' '}
                              {selectedEmail.fullThread.reply.responseTimeHours} hours
                            </div>
                          </div>
                        </div>
                        <div className="prose max-w-none text-gray-800 text-base leading-relaxed">
                          {selectedEmail.fullThread.reply.content
                            .split('\n')
                            .map((paragraph: string, index: number) => (
                              <p key={index} className="mb-4">
                                {paragraph}
                              </p>
                            ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <p>Select an email to view</p>
          </div>
        )}
      </div>

      <ComposeModal
        isOpen={showComposeModal}
        onClose={() => setShowComposeModal(false)}
        initialRecipients={recipients}
        initialTemplate={template}
        onEmailSent={handleEmailSent}
      />

      <ScoreAnalysisModal
        isOpen={showScoreAnalysisModal}
        onComplete={handleScoreAnalysisComplete}
        selectedEmails={emailsToScore}
      />
    </div>
  );
}
