'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RefreshCw, Activity, Database, Server, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface PerformanceData {
  timestamp: string;
  timeWindow: string;
  report: {
    requests: {
      totalRequests: number;
      averageResponseTime: number;
      errorRate: number;
      requestsPerSecond: number;
      slowRequestsCount: number;
      statusCodeDistribution: Record<string, number>;
      topSlowEndpoints: Array<{
        path: string;
        method: string;
        averageDuration: number;
        requestCount: number;
      }>;
    };
    database: {
      totalQueries: number;
      averageQueryTime: number;
      slowQueriesCount: number;
      cacheHitRate: number;
      topSlowQueries: Array<{
        operation: string;
        table: string;
        averageDuration: number;
        queryCount: number;
      }>;
    };
    system: {
      cpuUsage: number;
      memoryUsage: {
        used: number;
        total: number;
        percentage: number;
      };
      heapUsage: {
        used: number;
        total: number;
        percentage: number;
      };
      activeConnections: number;
      timestamp: string;
    } | null;
    alerts: Array<{
      level: 'info' | 'warning' | 'critical';
      message: string;
      metric: string;
      value: number;
    }>;
  };
}

interface LiveData {
  timestamp: string;
  system: {
    cpuUsage: number;
    memoryUsage: {
      used: number;
      total: number;
      percentage: number;
    };
    heapUsage: {
      used: number;
      total: number;
      percentage: number;
    };
    activeConnections: number;
    timestamp: string;
  } | null;
  requests: {
    last5Minutes: {
      totalRequests: number;
      averageResponseTime: number;
      errorRate: number;
      requestsPerSecond: number;
    };
  };
  database: {
    last5Minutes: {
      totalQueries: number;
      averageQueryTime: number;
      slowQueriesCount: number;
      cacheHitRate: number;
    };
  };
}

export default function PerformanceMonitor() {
  const [performanceData, setPerformanceData] = useState<PerformanceData | null>(null);
  const [liveData, setLiveData] = useState<LiveData | null>(null);
  const [timeWindow, setTimeWindow] = useState('3600000'); // 1 hour
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const timeWindowOptions = [
    { value: '300000', label: '5 minutes' },
    { value: '900000', label: '15 minutes' },
    { value: '1800000', label: '30 minutes' },
    { value: '3600000', label: '1 hour' },
    { value: '7200000', label: '2 hours' },
    { value: '14400000', label: '4 hours' },
    { value: '43200000', label: '12 hours' },
    { value: '86400000', label: '24 hours' }
  ];

  const fetchPerformanceData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [performanceResponse, liveResponse] = await Promise.all([
        fetch(`/api/v1/performance?timeWindow=${timeWindow}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            'Content-Type': 'application/json'
          }
        }),
        fetch('/api/v1/performance/live', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            'Content-Type': 'application/json'
          }
        })
      ]);

      if (!performanceResponse.ok || !liveResponse.ok) {
        throw new Error('Failed to fetch performance data');
      }

      const [performanceResult, liveResult] = await Promise.all([
        performanceResponse.json(),
        liveResponse.json()
      ]);

      setPerformanceData(performanceResult);
      setLiveData(liveResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch performance data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPerformanceData();
  }, [timeWindow]);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        fetchPerformanceData();
      }, 30000); // Refresh every 30 seconds

      return () => clearInterval(interval);
    }
  }, [autoRefresh, timeWindow]);

  const formatBytes = (bytes: number): string => {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  const formatDuration = (ms: number): string => {
    if (ms < 1000) return `${ms.toFixed(0)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const getAlertBadgeVariant = (level: string) => {
    switch (level) {
      case 'critical': return 'destructive';
      case 'warning': return 'secondary';
      case 'info': return 'outline';
      default: return 'outline';
    }
  };

  const getHealthStatus = (value: number, thresholds: { warning: number; critical: number }) => {
    if (value >= thresholds.critical) return { status: 'critical', color: 'text-red-600' };
    if (value >= thresholds.warning) return { status: 'warning', color: 'text-yellow-600' };
    return { status: 'good', color: 'text-green-600' };
  };

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
            <p>Error loading performance data: {error}</p>
            <Button onClick={fetchPerformanceData} className="mt-4">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Performance Monitor</h2>
          <p className="text-gray-600">Real-time application performance metrics</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={timeWindow} onValueChange={setTimeWindow}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {timeWindowOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={autoRefresh ? 'bg-green-50 border-green-200' : ''}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
            Auto Refresh {autoRefresh ? 'On' : 'Off'}
          </Button>
          <Button variant="outline" size="sm" onClick={fetchPerformanceData} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Alerts */}
      {performanceData?.report.alerts && performanceData.report.alerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Performance Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {performanceData.report.alerts.map((alert, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                  <div className="flex items-center gap-3">
                    <Badge variant={getAlertBadgeVariant(alert.level)}>
                      {alert.level.toUpperCase()}
                    </Badge>
                    <span className="text-sm">{alert.message}</span>
                  </div>
                  <span className="text-sm text-gray-500">{alert.metric}: {alert.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Live Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* System Health */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              System Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            {liveData?.system ? (
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Memory Usage</span>
                    <span className={getHealthStatus(liveData.system.memoryUsage.percentage, { warning: 70, critical: 85 }).color}>
                      {liveData.system.memoryUsage.percentage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div
                      className="bg-teal-600 h-2 rounded-full"
                      style={{ width: `${liveData.system.memoryUsage.percentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatBytes(liveData.system.memoryUsage.used)} / {formatBytes(liveData.system.memoryUsage.total)}
                  </p>
                </div>
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Heap Usage</span>
                    <span className={getHealthStatus(liveData.system.heapUsage.percentage, { warning: 70, critical: 85 }).color}>
                      {liveData.system.heapUsage.percentage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div
                      className="bg-amber-600 h-2 rounded-full"
                      style={{ width: `${liveData.system.heapUsage.percentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatBytes(liveData.system.heapUsage.used)} / {formatBytes(liveData.system.heapUsage.total)}
                  </p>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Active Connections</span>
                  <span className="text-sm font-medium">{liveData.system.activeConnections}</span>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">No system data available</p>
            )}
          </CardContent>
        </Card>

        {/* Request Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Request Performance (5min)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {liveData?.requests ? (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Total Requests</span>
                  <span className="text-sm font-medium">{liveData.requests.last5Minutes.totalRequests}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Avg Response Time</span>
                  <span className={`text-sm font-medium ${getHealthStatus(liveData.requests.last5Minutes.averageResponseTime, { warning: 1000, critical: 2000 }).color}`}>
                    {formatDuration(liveData.requests.last5Minutes.averageResponseTime)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Error Rate</span>
                  <span className={`text-sm font-medium ${getHealthStatus(liveData.requests.last5Minutes.errorRate, { warning: 5, critical: 10 }).color}`}>
                    {liveData.requests.last5Minutes.errorRate.toFixed(2)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Requests/sec</span>
                  <span className="text-sm font-medium">{liveData.requests.last5Minutes.requestsPerSecond.toFixed(2)}</span>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">No request data available</p>
            )}
          </CardContent>
        </Card>

        {/* Database Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Database Performance (5min)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {liveData?.database ? (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Total Queries</span>
                  <span className="text-sm font-medium">{liveData.database.last5Minutes.totalQueries}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Avg Query Time</span>
                  <span className={`text-sm font-medium ${getHealthStatus(liveData.database.last5Minutes.averageQueryTime, { warning: 500, critical: 1000 }).color}`}>
                    {formatDuration(liveData.database.last5Minutes.averageQueryTime)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Slow Queries</span>
                  <span className="text-sm font-medium">{liveData.database.last5Minutes.slowQueriesCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Cache Hit Rate</span>
                  <span className={`text-sm font-medium ${getHealthStatus(100 - liveData.database.last5Minutes.cacheHitRate, { warning: 20, critical: 40 }).color}`}>
                    {liveData.database.last5Minutes.cacheHitRate.toFixed(1)}%
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">No database data available</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Detailed Statistics */}
      {performanceData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Request Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Request Statistics ({performanceData.timeWindow})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Total Requests</p>
                    <p className="text-2xl font-bold">{performanceData.report.requests.totalRequests.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Requests/sec</p>
                    <p className="text-2xl font-bold">{performanceData.report.requests.requestsPerSecond.toFixed(2)}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-2">Status Code Distribution</p>
                  <div className="space-y-1">
                    {Object.entries(performanceData.report.requests.statusCodeDistribution).map(([code, count]) => (
                      <div key={code} className="flex justify-between text-sm">
                        <span>{code}</span>
                        <span>{count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {performanceData.report.requests.topSlowEndpoints.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Slowest Endpoints</p>
                    <div className="space-y-1">
                      {performanceData.report.requests.topSlowEndpoints.slice(0, 5).map((endpoint, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="truncate">{endpoint.method} {endpoint.path}</span>
                          <span>{formatDuration(endpoint.averageDuration)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Database Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Database Statistics ({performanceData.timeWindow})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Total Queries</p>
                    <p className="text-2xl font-bold">{performanceData.report.database.totalQueries.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Cache Hit Rate</p>
                    <p className="text-2xl font-bold">{performanceData.report.database.cacheHitRate.toFixed(1)}%</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Avg Query Time</p>
                    <p className="text-lg font-semibold">{formatDuration(performanceData.report.database.averageQueryTime)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Slow Queries</p>
                    <p className="text-lg font-semibold">{performanceData.report.database.slowQueriesCount}</p>
                  </div>
                </div>

                {performanceData.report.database.topSlowQueries.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Slowest Operations</p>
                    <div className="space-y-1">
                      {performanceData.report.database.topSlowQueries.slice(0, 5).map((query, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="truncate">{query.operation} ({query.table})</span>
                          <span>{formatDuration(query.averageDuration)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Footer */}
      <div className="text-center text-sm text-gray-500">
        Last updated: {liveData?.timestamp ? new Date(liveData.timestamp).toLocaleString() : 'Never'}
      </div>
    </div>
  );
}