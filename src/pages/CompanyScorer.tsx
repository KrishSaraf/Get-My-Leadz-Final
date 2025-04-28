import { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Search, ArrowUpDown, MessageSquare, Clock, Brain, BarChart4, Mail, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type SortDirection = 'asc' | 'desc';

export function CompanyScorer() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Get scored interactions from localStorage
  const scoredInteractions = JSON.parse(localStorage.getItem('scoredInteractions') || '[]');

  const sortedInteractions = [...scoredInteractions].sort((a, b) => {
    return sortDirection === 'desc' 
      ? b.leadScore - a.leadScore 
      : a.leadScore - b.leadScore;
  });

  const filteredInteractions = sortedInteractions.filter(interaction => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      interaction.from.name.toLowerCase().includes(query) ||
      interaction.from.email.toLowerCase().includes(query)
    );
  });

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'bg-green-500';
    if (score >= 0.5) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 0.8) return 'from-green-500/20 to-green-500/5';
    if (score >= 0.5) return 'from-yellow-500/20 to-yellow-500/5';
    return 'from-red-500/20 to-red-500/5';
  };

  const getMetricIcon = (score: number) => {
    if (score >= 0.8) return <Brain className="w-5 h-5 text-green-500" />;
    if (score >= 0.5) return <Clock className="w-5 h-5 text-yellow-500" />;
    return <MessageSquare className="w-5 h-5 text-red-500" />;
  };

  // If no scored interactions, show empty state
  if (scoredInteractions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)]">
        <div className="w-16 h-16 bg-[#5B3CC4]/10 rounded-full flex items-center justify-center mb-6">
          <Brain className="w-8 h-8 text-[#5B3CC4]" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">No Scored Responses Yet</h2>
        <p className="text-gray-500 text-center max-w-md mb-8">
          Head over to the Emails section to analyze and score customer responses. Once scored, they'll appear here for detailed analysis.
        </p>
        <Button onClick={() => navigate('/email')}>
          <Mail className="w-5 h-5 mr-2" />
          Go to Emails
        </Button>
      </div>
    );
  }

  // If all interactions are scored, show completion message
  if (scoredInteractions.length === 6) {
    return (
      <div className="space-y-6">
        <div className="bg-green-50 border border-green-100 rounded-lg p-6 mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-green-900">Responses Scored!</h2>
          </div>
          <p className="text-green-700">
            Scoring is already completed and stored in the database as seen in the demo.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Lead Scoring Analysis</h1>
              <p className="text-gray-500 mt-1">
                Analyze and score potential leads based on engagement metrics
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-[300px] border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B3CC4] focus:border-transparent"
                />
              </div>
              <button
                onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ArrowUpDown className="w-4 h-4" />
                <span>Sort by Score</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-6">
            <div className="bg-[#5B3CC4]/5 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Brain className="w-5 h-5 text-[#5B3CC4]" />
                <span className="font-medium text-gray-700">High Intent</span>
              </div>
              <p className="text-2xl font-bold text-[#5B3CC4]">
                {filteredInteractions.filter(i => i.leadScore >= 0.8).length}
              </p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="w-5 h-5 text-yellow-600" />
                <span className="font-medium text-gray-700">Medium Intent</span>
              </div>
              <p className="text-2xl font-bold text-yellow-600">
                {filteredInteractions.filter(i => i.leadScore >= 0.5 && i.leadScore < 0.8).length}
              </p>
            </div>
            <div className="bg-red-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <MessageSquare className="w-5 h-5 text-red-600" />
                <span className="font-medium text-gray-700">Low Intent</span>
              </div>
              <p className="text-2xl font-bold text-red-600">
                {filteredInteractions.filter(i => i.leadScore < 0.5).length}
              </p>
            </div>
          </div>
        </div>

        {/* Lead Cards */}
        <div className="grid grid-cols-1 gap-6">
          {filteredInteractions.map(interaction => (
            <Card 
              key={interaction.id} 
              className={`p-6 bg-gradient-to-b ${getScoreGradient(interaction.leadScore)}`}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-xl font-semibold shadow-sm border border-gray-100">
                      {interaction.from.name[0]}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{interaction.from.name}</h3>
                      <p className="text-gray-500">{interaction.from.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Response Time</p>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">{interaction.reply.responseTimeHours} hours</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Probability of Conversion</p>
                      <div className="flex items-center space-x-2">
                        <BarChart4 className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">
                          {Math.round(interaction.leadScore * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end space-y-2">
                  {getMetricIcon(interaction.leadScore)}
                  <div 
                    className={`text-2xl font-bold ${
                      interaction.leadScore >= 0.8 ? 'text-green-600' :
                      interaction.leadScore >= 0.5 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}
                  >
                    {Math.round(interaction.leadScore * 100)}%
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="bg-white rounded-lg p-4 border border-gray-100">
                  <h4 className="font-medium mb-2 flex items-center space-x-2">
                    <MessageSquare className="w-4 h-4 text-gray-400" />
                    <span>Response Content</span>
                  </h4>
                  <p className="text-gray-600">{interaction.reply.content}</p>
                </div>

                <div className="bg-white rounded-lg p-4 border border-gray-100">
                  <h4 className="font-medium mb-2 flex items-center space-x-2">
                    <Brain className="w-4 h-4 text-gray-400" />
                    <span>Analysis</span>
                  </h4>
                  <p className="text-gray-600">{interaction.explanation}</p>
                </div>

                <div className="relative pt-2">
                  <div className="overflow-hidden h-1 flex rounded bg-gray-200">
                    <div
                      style={{ width: `${interaction.leadScore * 100}%` }}
                      className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${getScoreColor(interaction.leadScore)}`}
                    />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Lead Scoring Analysis</h1>
            <p className="text-gray-500 mt-1">
              Analyze and score potential leads based on engagement metrics
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-[300px] border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B3CC4] focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowUpDown className="w-4 h-4" />
              <span>Sort by Score</span>
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          <div className="bg-[#5B3CC4]/5 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Brain className="w-5 h-5 text-[#5B3CC4]" />
              <span className="font-medium text-gray-700">High Intent</span>
            </div>
            <p className="text-2xl font-bold text-[#5B3CC4]">
              {filteredInteractions.filter(i => i.leadScore >= 0.8).length}
            </p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="w-5 h-5 text-yellow-600" />
              <span className="font-medium text-gray-700">Medium Intent</span>
            </div>
            <p className="text-2xl font-bold text-yellow-600">
              {filteredInteractions.filter(i => i.leadScore >= 0.5 && i.leadScore < 0.8).length}
            </p>
          </div>
          <div className="bg-red-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <MessageSquare className="w-5 h-5 text-red-600" />
              <span className="font-medium text-gray-700">Low Intent</span>
            </div>
            <p className="text-2xl font-bold text-red-600">
              {filteredInteractions.filter(i => i.leadScore < 0.5).length}
            </p>
          </div>
        </div>
      </div>

      {/* Lead Cards */}
      <div className="grid grid-cols-1 gap-6">
        {filteredInteractions.map(interaction => (
          <Card 
            key={interaction.id} 
            className={`p-6 bg-gradient-to-b ${getScoreGradient(interaction.leadScore)}`}
          >
            <div className="flex items-start justify-between">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-xl font-semibold shadow-sm border border-gray-100">
                    {interaction.from.name[0]}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{interaction.from.name}</h3>
                    <p className="text-gray-500">{interaction.from.email}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Response Time</p>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">{interaction.reply.responseTimeHours} hours</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Probability of Conversion</p>
                    <div className="flex items-center space-x-2">
                      <BarChart4 className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">
                        {Math.round(interaction.leadScore * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end space-y-2">
                {getMetricIcon(interaction.leadScore)}
                <div 
                  className={`text-2xl font-bold ${
                    interaction.leadScore >= 0.8 ? 'text-green-600' :
                    interaction.leadScore >= 0.5 ? 'text-yellow-600' :
                    'text-red-600'
                  }`}
                >
                  {Math.round(interaction.leadScore * 100)}%
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="bg-white rounded-lg p-4 border border-gray-100">
                <h4 className="font-medium mb-2 flex items-center space-x-2">
                  <MessageSquare className="w-4 h-4 text-gray-400" />
                  <span>Response Content</span>
                </h4>
                <p className="text-gray-600">{interaction.reply.content}</p>
              </div>

              <div className="bg-white rounded-lg p-4 border border-gray-100">
                <h4 className="font-medium mb-2 flex items-center space-x-2">
                  <Brain className="w-4 h-4 text-gray-400" />
                  <span>Analysis</span>
                </h4>
                <p className="text-gray-600">{interaction.explanation}</p>
              </div>

              <div className="relative pt-2">
                <div className="overflow-hidden h-1 flex rounded bg-gray-200">
                  <div
                    style={{ width: `${interaction.leadScore * 100}%` }}
                    className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${getScoreColor(interaction.leadScore)}`}
                  />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}