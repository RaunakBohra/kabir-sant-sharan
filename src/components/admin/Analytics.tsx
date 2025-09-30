'use client';

import { useState, useEffect, useCallback } from 'react';

interface AnalyticsData {
  totalVisitors: number;
  pageViews: number;
  avgSessionDuration: string;
  bounceRate: string;
}

interface TopPage {
  path: string;
  title: string;
  views: number;
}

interface RecentActivity {
  type: 'visit' | 'search';
  page?: string;
  query?: string;
  time: string;
}

export function Analytics() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [topPages, setTopPages] = useState<TopPage[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadAnalyticsData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [overviewRes, topPagesRes, activityRes] = await Promise.all([
        fetch('/api/analytics/overview/'),
        fetch('/api/analytics/top-pages/?limit=10'),
        fetch('/api/analytics/recent-activity/?limit=10')
      ]);

      const overview = await overviewRes.json() as AnalyticsData;
      const topPagesData = await topPagesRes.json() as { topPages: TopPage[] };
      const activityData = await activityRes.json() as { recentActivity: RecentActivity[] };

      setAnalyticsData(overview);
      setTopPages(topPagesData.topPages || []);
      setRecentActivity(activityData.recentActivity || []);
    } catch (error) {
      console.error('Failed to load analytics data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAnalyticsData();
  }, [loadAnalyticsData]);

  if (isLoading || !analyticsData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dark-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Stats - Compact Single Line */}
      <div className="bg-cream-50 p-3 rounded-lg shadow-sm border border-cream-200">
        <div className="flex items-center justify-around text-center divide-x divide-cream-200">
          <div className="flex-1 px-4">
            <p className="text-xs text-dark-600">Visitors</p>
            <p className="text-lg font-bold text-dark-900">{analyticsData.totalVisitors.toLocaleString()}</p>
          </div>
          <div className="flex-1 px-4">
            <p className="text-xs text-dark-600">Page Views</p>
            <p className="text-lg font-bold text-dark-900">{analyticsData.pageViews.toLocaleString()}</p>
          </div>
          <div className="flex-1 px-4">
            <p className="text-xs text-dark-600">Avg. Session</p>
            <p className="text-lg font-bold text-dark-900">{analyticsData.avgSessionDuration}</p>
          </div>
          <div className="flex-1 px-4">
            <p className="text-xs text-dark-600">Bounce Rate</p>
            <p className="text-lg font-bold text-dark-900">{analyticsData.bounceRate}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <div className="bg-cream-50 rounded-lg shadow-lg border border-cream-200">
          <div className="px-6 py-4 border-b border-cream-200">
            <h3 className="text-lg font-medium text-dark-900">Top Pages</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {topPages.map((page, index) => (
                <div key={page.path} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-dark-500 w-6">{index + 1}.</span>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-dark-900">{page.title}</p>
                      <p className="text-xs text-dark-500">{page.path}</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-dark-900">{page.views.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-cream-50 rounded-lg shadow-lg border border-cream-200">
          <div className="px-6 py-4 border-b border-cream-200">
            <h3 className="text-lg font-medium text-dark-900">Recent Activity</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === 'visit' ? 'bg-dark-500' : 'bg-dark-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm text-dark-900">
                      {activity.type === 'visit' ? 'Page visit:' : 'Search:'}
                      <span className="font-medium ml-1">
                        {activity.type === 'visit' ? activity.page : activity.query}
                      </span>
                    </p>
                    <p className="text-xs text-dark-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}