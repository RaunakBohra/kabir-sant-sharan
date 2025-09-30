'use client';

import { useState, useEffect, useCallback } from 'react';

interface NewsletterSubscriber {
  id: string;
  email: string;
  name?: string;
  subscribedAt: string;
  isActive: boolean;
  preferences: {
    teachings: boolean;
    events: boolean;
    meditation: boolean;
  };
}

interface NewsletterCampaign {
  id: string;
  subject: string;
  content: string;
  sentAt?: string;
  status: 'draft' | 'sent' | 'scheduled';
  recipients: number;
  opens: number;
  clicks: number;
}

export function Newsletter() {
  const [activeTab, setActiveTab] = useState<'subscribers' | 'campaigns' | 'compose'>('subscribers');
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [campaigns, setCampaigns] = useState<NewsletterCampaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Newsletter composition state
  const [emailSubject, setEmailSubject] = useState('');
  const [emailContent, setEmailContent] = useState('');
  const [selectedSegment, setSelectedSegment] = useState<'all' | 'teachings' | 'events' | 'meditation'>('all');

  const loadNewsletterData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [subscribersRes, campaignsRes] = await Promise.all([
        fetch('/api/newsletter/subscribers/?limit=100'),
        fetch('/api/newsletter/campaigns/?limit=50')
      ]);

      const subscribersData = await subscribersRes.json() as { subscribers: NewsletterSubscriber[] };
      const campaignsData = await campaignsRes.json() as { campaigns: NewsletterCampaign[] };

      setSubscribers(subscribersData.subscribers || []);
      setCampaigns(campaignsData.campaigns || []);
    } catch (error) {
      console.error('Failed to load newsletter data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNewsletterData();
  }, [loadNewsletterData]);

  const handleSendNewsletter = async () => {
    if (!emailSubject.trim() || !emailContent.trim()) {
      alert('Please fill in both subject and content');
      return;
    }

    try {
      const response = await fetch('/api/newsletter/campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          subject: emailSubject,
          content: emailContent,
          segment: selectedSegment,
          status: 'sent'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send newsletter');
      }

      const data = await response.json() as { campaign: NewsletterCampaign };

      setCampaigns(prev => [data.campaign, ...prev]);
      setEmailSubject('');
      setEmailContent('');
      setActiveTab('campaigns');

      alert('Newsletter sent successfully!');
    } catch (error) {
      console.error('Failed to send newsletter:', error);
      alert('Failed to send newsletter');
    }
  };

  const getSubscribersBySegment = () => {
    if (selectedSegment === 'all') return subscribers.filter(s => s.isActive);
    return subscribers.filter(s =>
      s.isActive && s.preferences[selectedSegment as keyof typeof s.preferences]
    );
  };

  const tabs = [
    { id: 'subscribers' as const, label: 'Subscribers', count: subscribers.filter(s => s.isActive).length },
    { id: 'campaigns' as const, label: 'Campaigns', count: campaigns.length },
    { id: 'compose' as const, label: 'Compose', count: null }
  ];

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="bg-cream-50 rounded-lg shadow-lg border border-cream-200">
        <div className="border-b border-cream-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-dark-900 text-dark-900'
                    : 'border-transparent text-dark-500 hover:text-dark-700 hover:border-cream-300'
                }`}
              >
                <span>{tab.label}</span>
                {tab.count !== null && (
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-dark-900"></div>
            </div>
          ) : (
            <>
              {/* Subscribers Tab */}
              {activeTab === 'subscribers' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">Email Subscribers</h3>
                    <div className="flex space-x-2">
                      <button className="bg-dark-900 text-white px-4 py-2 rounded-lg hover:bg-dark-800 text-sm transition-colors duration-200">
                        Export List
                      </button>
                      <button className="bg-dark-900 text-white px-4 py-2 rounded-lg hover:bg-dark-800 text-sm transition-colors duration-200">
                        Add Subscriber
                      </button>
                    </div>
                  </div>

                  <div className="bg-cream-100 rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-cream-200">
                      <thead className="bg-cream-100">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
                            Subscriber
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
                            Preferences
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
                            Subscribed
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-cream-200">
                        {subscribers.map((subscriber) => (
                          <tr key={subscriber.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-dark-900">
                                  {subscriber.name || 'Anonymous'}
                                </div>
                                <div className="text-sm text-dark-500">{subscriber.email}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex space-x-2">
                                {subscriber.preferences.teachings && (
                                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                                    Teachings
                                  </span>
                                )}
                                {subscriber.preferences.events && (
                                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                                    Events
                                  </span>
                                )}
                                {subscriber.preferences.meditation && (
                                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
                                    Meditation
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-500">
                              {new Date(subscriber.subscribedAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                subscriber.isActive
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {subscriber.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Campaigns Tab */}
              {activeTab === 'campaigns' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">Email Campaigns</h3>
                    <button
                      onClick={() => setActiveTab('compose')}
                      className="bg-dark-900 text-white px-4 py-2 rounded-lg hover:bg-dark-800 text-sm transition-colors duration-200"
                    >
                      Create Campaign
                    </button>
                  </div>

                  <div className="space-y-4">
                    {campaigns.map((campaign) => (
                      <div key={campaign.id} className="bg-cream-100 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{campaign.subject}</h4>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                              {campaign.content.substring(0, 100)}...
                            </p>
                          </div>
                          <div className="ml-4 text-right">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              campaign.status === 'sent'
                                ? 'bg-green-100 text-green-800'
                                : campaign.status === 'draft'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                            </span>
                          </div>
                        </div>
                        {campaign.status === 'sent' && (
                          <div className="mt-3 flex space-x-6 text-sm text-gray-600">
                            <span>Recipients: {campaign.recipients}</span>
                            <span>Opens: {campaign.opens} ({Math.round((campaign.opens / campaign.recipients) * 100)}%)</span>
                            <span>Clicks: {campaign.clicks} ({Math.round((campaign.clicks / campaign.recipients) * 100)}%)</span>
                          </div>
                        )}
                        {campaign.sentAt && (
                          <div className="mt-2 text-xs text-gray-500">
                            Sent: {new Date(campaign.sentAt).toLocaleString()}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Compose Tab */}
              {activeTab === 'compose' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900">Compose Newsletter</h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subject Line
                      </label>
                      <input
                        type="text"
                        value={emailSubject}
                        onChange={(e) => setEmailSubject(e.target.value)}
                        className="w-full px-3 py-2 border border-cream-300 rounded-md focus:ring-dark-500 focus:border-dark-900 bg-white"
                        placeholder="Enter email subject..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Audience Segment
                      </label>
                      <select
                        value={selectedSegment}
                        onChange={(e) => setSelectedSegment(e.target.value as any)}
                        className="w-full px-3 py-2 border border-cream-300 rounded-md focus:ring-dark-500 focus:border-dark-900 bg-white"
                      >
                        <option value="all">All Active Subscribers ({subscribers.filter(s => s.isActive).length})</option>
                        <option value="teachings">Teachings Subscribers ({getSubscribersBySegment().length})</option>
                        <option value="events">Events Subscribers</option>
                        <option value="meditation">Meditation Subscribers</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Content
                      </label>
                      <textarea
                        value={emailContent}
                        onChange={(e) => setEmailContent(e.target.value)}
                        rows={12}
                        className="w-full px-3 py-2 border border-cream-300 rounded-md focus:ring-dark-500 focus:border-dark-900 bg-white"
                        placeholder="Write your newsletter content here..."
                      />
                    </div>

                    <div className="flex space-x-4">
                      <button
                        onClick={handleSendNewsletter}
                        className="bg-dark-900 text-white px-6 py-2 rounded-lg hover:bg-dark-800 transition-colors duration-200"
                      >
                        Send Newsletter
                      </button>
                      <button
                        onClick={() => {
                          // Save as draft logic
                          alert('Saved as draft');
                        }}
                        className="bg-dark-600 text-white px-6 py-2 rounded-lg hover:bg-dark-700 transition-colors duration-200"
                      >
                        Save as Draft
                      </button>
                      <button
                        onClick={() => {
                          setEmailSubject('');
                          setEmailContent('');
                        }}
                        className="border border-cream-300 text-dark-700 px-6 py-2 rounded-lg hover:bg-cream-50 transition-colors duration-200"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}