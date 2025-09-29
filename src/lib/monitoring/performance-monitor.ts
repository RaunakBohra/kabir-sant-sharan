import { logger } from '../logger';
import { createId } from '@paralleldrive/cuid2';

export interface PerformanceMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  timestamp: Date;
  labels?: Record<string, string>;
  context?: Record<string, any>;
}

export interface RequestPerformanceData {
  requestId: string;
  method: string;
  path: string;
  statusCode: number;
  duration: number;
  responseSize?: number;
  userAgent?: string;
  ip?: string;
  userId?: string;
  timestamp: Date;
}

export interface DatabasePerformanceData {
  queryId: string;
  operation: string;
  table?: string;
  duration: number;
  rows?: number;
  cached?: boolean;
  timestamp: Date;
}

export interface SystemPerformanceData {
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
  timestamp: Date;
}

class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetric[]> = new Map();
  private requestMetrics: RequestPerformanceData[] = [];
  private databaseMetrics: DatabasePerformanceData[] = [];
  private systemMetrics: SystemPerformanceData[] = [];

  private readonly maxMetricsHistory = 1000;
  private readonly metricsRetentionMs = 24 * 60 * 60 * 1000; // 24 hours

  constructor() {
    // Clean up old metrics every hour
    setInterval(() => {
      this.cleanupOldMetrics();
    }, 60 * 60 * 1000);

    // Collect system metrics every 30 seconds
    setInterval(() => {
      this.collectSystemMetrics();
    }, 30 * 1000);
  }

  /**
   * Record a custom performance metric
   */
  recordMetric(metric: Omit<PerformanceMetric, 'id' | 'timestamp'>): void {
    const fullMetric: PerformanceMetric = {
      ...metric,
      id: createId(),
      timestamp: new Date()
    };

    const metricKey = metric.name;
    if (!this.metrics.has(metricKey)) {
      this.metrics.set(metricKey, []);
    }

    const metricArray = this.metrics.get(metricKey)!;
    metricArray.push(fullMetric);

    // Keep only recent metrics
    if (metricArray.length > this.maxMetricsHistory) {
      metricArray.splice(0, metricArray.length - this.maxMetricsHistory);
    }

    logger.debug('Performance metric recorded', {
      metric: fullMetric,
      component: 'performance-monitor'
    });
  }

  /**
   * Record request performance data
   */
  recordRequest(data: Omit<RequestPerformanceData, 'requestId' | 'timestamp'>): string {
    const requestData: RequestPerformanceData = {
      ...data,
      requestId: createId(),
      timestamp: new Date()
    };

    this.requestMetrics.push(requestData);

    // Keep only recent requests
    if (this.requestMetrics.length > this.maxMetricsHistory) {
      this.requestMetrics.splice(0, this.requestMetrics.length - this.maxMetricsHistory);
    }

    // Record as metric for aggregation
    this.recordMetric({
      name: 'http_request_duration',
      value: data.duration,
      unit: 'ms',
      labels: {
        method: data.method,
        path: data.path,
        status: data.statusCode.toString()
      }
    });

    // Log slow requests
    if (data.duration > 1000) {
      logger.warn('Slow request detected', {
        ...requestData,
        component: 'performance-monitor'
      });
    }

    return requestData.requestId;
  }

  /**
   * Record database operation performance
   */
  recordDatabaseOperation(data: Omit<DatabasePerformanceData, 'queryId' | 'timestamp'>): string {
    const queryData: DatabasePerformanceData = {
      ...data,
      queryId: createId(),
      timestamp: new Date()
    };

    this.databaseMetrics.push(queryData);

    // Keep only recent queries
    if (this.databaseMetrics.length > this.maxMetricsHistory) {
      this.databaseMetrics.splice(0, this.databaseMetrics.length - this.maxMetricsHistory);
    }

    // Record as metric for aggregation
    this.recordMetric({
      name: 'database_query_duration',
      value: data.duration,
      unit: 'ms',
      labels: {
        operation: data.operation,
        table: data.table || 'unknown',
        cached: data.cached ? 'true' : 'false'
      }
    });

    // Log slow queries
    if (data.duration > 500) {
      logger.warn('Slow database query detected', {
        ...queryData,
        component: 'performance-monitor'
      });
    }

    return queryData.queryId;
  }

  /**
   * Collect system performance metrics
   */
  private async collectSystemMetrics(): Promise<void> {
    try {
      const memoryUsage = process.memoryUsage();
      const cpuUsage = process.cpuUsage();

      // Calculate memory percentages (approximation)
      const totalMemory = memoryUsage.rss + memoryUsage.heapTotal + memoryUsage.external;
      const heapPercentage = (memoryUsage.heapUsed / memoryUsage.heapTotal) * 100;

      const systemData: SystemPerformanceData = {
        cpuUsage: (cpuUsage.user + cpuUsage.system) / 1000000, // Convert to seconds
        memoryUsage: {
          used: memoryUsage.rss,
          total: totalMemory,
          percentage: (memoryUsage.rss / totalMemory) * 100
        },
        heapUsage: {
          used: memoryUsage.heapUsed,
          total: memoryUsage.heapTotal,
          percentage: heapPercentage
        },
        activeConnections: this.getActiveConnectionsCount(),
        timestamp: new Date()
      };

      this.systemMetrics.push(systemData);

      // Keep only recent system metrics
      if (this.systemMetrics.length > this.maxMetricsHistory) {
        this.systemMetrics.splice(0, this.systemMetrics.length - this.maxMetricsHistory);
      }

      // Record individual metrics
      this.recordMetric({
        name: 'memory_usage_percentage',
        value: systemData.memoryUsage.percentage,
        unit: 'percent'
      });

      this.recordMetric({
        name: 'heap_usage_percentage',
        value: systemData.heapUsage.percentage,
        unit: 'percent'
      });

      this.recordMetric({
        name: 'active_connections',
        value: systemData.activeConnections,
        unit: 'count'
      });

      // Alert on high resource usage
      if (heapPercentage > 85) {
        logger.warn('High heap memory usage detected', {
          heapPercentage,
          heapUsed: memoryUsage.heapUsed,
          heapTotal: memoryUsage.heapTotal,
          component: 'performance-monitor'
        });
      }

    } catch (error) {
      logger.error('Failed to collect system metrics', {
        error: error instanceof Error ? error.message : String(error),
        component: 'performance-monitor'
      });
    }
  }

  /**
   * Get active connections count (approximation)
   */
  private getActiveConnectionsCount(): number {
    // This is a simplified implementation
    // In a real application, you would track actual connections
    return this.requestMetrics.filter(r =>
      Date.now() - r.timestamp.getTime() < 60000
    ).length;
  }

  /**
   * Get performance statistics for a specific metric
   */
  getMetricStats(metricName: string, timeWindow?: number): {
    count: number;
    average: number;
    min: number;
    max: number;
    percentiles: {
      p50: number;
      p90: number;
      p95: number;
      p99: number;
    };
  } | null {
    const metrics = this.metrics.get(metricName);
    if (!metrics || metrics.length === 0) {
      return null;
    }

    const cutoffTime = timeWindow ? Date.now() - timeWindow : 0;
    const recentMetrics = metrics.filter(m => m.timestamp.getTime() > cutoffTime);

    if (recentMetrics.length === 0) {
      return null;
    }

    const values = recentMetrics.map(m => m.value).sort((a, b) => a - b);
    const count = values.length;
    const sum = values.reduce((a, b) => a + b, 0);

    return {
      count,
      average: sum / count,
      min: values[0],
      max: values[count - 1],
      percentiles: {
        p50: values[Math.floor(count * 0.5)],
        p90: values[Math.floor(count * 0.9)],
        p95: values[Math.floor(count * 0.95)],
        p99: values[Math.floor(count * 0.99)]
      }
    };
  }

  /**
   * Get request performance statistics
   */
  getRequestStats(timeWindow?: number): {
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
  } {
    const cutoffTime = timeWindow ? Date.now() - timeWindow : 0;
    const requests = this.requestMetrics.filter(r => r.timestamp.getTime() > cutoffTime);

    if (requests.length === 0) {
      return {
        totalRequests: 0,
        averageResponseTime: 0,
        errorRate: 0,
        requestsPerSecond: 0,
        slowRequestsCount: 0,
        statusCodeDistribution: {},
        topSlowEndpoints: []
      };
    }

    const totalDuration = requests.reduce((sum, r) => sum + r.duration, 0);
    const errorRequests = requests.filter(r => r.statusCode >= 400);
    const slowRequests = requests.filter(r => r.duration > 1000);

    const timeSpanMs = timeWindow || (Date.now() - requests[0].timestamp.getTime());
    const requestsPerSecond = (requests.length / timeSpanMs) * 1000;

    // Status code distribution
    const statusCodeDistribution: Record<string, number> = {};
    requests.forEach(r => {
      const statusRange = `${Math.floor(r.statusCode / 100)}xx`;
      statusCodeDistribution[statusRange] = (statusCodeDistribution[statusRange] || 0) + 1;
    });

    // Top slow endpoints
    const endpointStats = new Map<string, { totalDuration: number; count: number }>();
    requests.forEach(r => {
      const key = `${r.method} ${r.path}`;
      const existing = endpointStats.get(key) || { totalDuration: 0, count: 0 };
      endpointStats.set(key, {
        totalDuration: existing.totalDuration + r.duration,
        count: existing.count + 1
      });
    });

    const topSlowEndpoints = Array.from(endpointStats.entries())
      .map(([key, stats]) => {
        const [method, path] = key.split(' ', 2);
        return {
          path,
          method,
          averageDuration: stats.totalDuration / stats.count,
          requestCount: stats.count
        };
      })
      .sort((a, b) => b.averageDuration - a.averageDuration)
      .slice(0, 10);

    return {
      totalRequests: requests.length,
      averageResponseTime: totalDuration / requests.length,
      errorRate: (errorRequests.length / requests.length) * 100,
      requestsPerSecond,
      slowRequestsCount: slowRequests.length,
      statusCodeDistribution,
      topSlowEndpoints
    };
  }

  /**
   * Get database performance statistics
   */
  getDatabaseStats(timeWindow?: number): {
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
  } {
    const cutoffTime = timeWindow ? Date.now() - timeWindow : 0;
    const queries = this.databaseMetrics.filter(q => q.timestamp.getTime() > cutoffTime);

    if (queries.length === 0) {
      return {
        totalQueries: 0,
        averageQueryTime: 0,
        slowQueriesCount: 0,
        cacheHitRate: 0,
        topSlowQueries: []
      };
    }

    const totalDuration = queries.reduce((sum, q) => sum + q.duration, 0);
    const slowQueries = queries.filter(q => q.duration > 500);
    const cachedQueries = queries.filter(q => q.cached);

    // Top slow operations
    const operationStats = new Map<string, { totalDuration: number; count: number }>();
    queries.forEach(q => {
      const key = `${q.operation}:${q.table || 'unknown'}`;
      const existing = operationStats.get(key) || { totalDuration: 0, count: 0 };
      operationStats.set(key, {
        totalDuration: existing.totalDuration + q.duration,
        count: existing.count + 1
      });
    });

    const topSlowQueries = Array.from(operationStats.entries())
      .map(([key, stats]) => {
        const [operation, table] = key.split(':');
        return {
          operation,
          table,
          averageDuration: stats.totalDuration / stats.count,
          queryCount: stats.count
        };
      })
      .sort((a, b) => b.averageDuration - a.averageDuration)
      .slice(0, 10);

    return {
      totalQueries: queries.length,
      averageQueryTime: totalDuration / queries.length,
      slowQueriesCount: slowQueries.length,
      cacheHitRate: (cachedQueries.length / queries.length) * 100,
      topSlowQueries
    };
  }

  /**
   * Get current system performance
   */
  getCurrentSystemStats(): SystemPerformanceData | null {
    return this.systemMetrics.length > 0
      ? this.systemMetrics[this.systemMetrics.length - 1]
      : null;
  }

  /**
   * Clean up old metrics to prevent memory leaks
   */
  private cleanupOldMetrics(): void {
    const cutoffTime = Date.now() - this.metricsRetentionMs;

    // Clean up custom metrics
    this.metrics.forEach((metricArray, key) => {
      const filtered = metricArray.filter(m => m.timestamp.getTime() > cutoffTime);
      if (filtered.length === 0) {
        this.metrics.delete(key);
      } else {
        this.metrics.set(key, filtered);
      }
    });

    // Clean up request metrics
    this.requestMetrics = this.requestMetrics.filter(r => r.timestamp.getTime() > cutoffTime);

    // Clean up database metrics
    this.databaseMetrics = this.databaseMetrics.filter(q => q.timestamp.getTime() > cutoffTime);

    // Clean up system metrics
    this.systemMetrics = this.systemMetrics.filter(s => s.timestamp.getTime() > cutoffTime);

    logger.debug('Old performance metrics cleaned up', {
      cutoffTime: new Date(cutoffTime),
      component: 'performance-monitor'
    });
  }

  /**
   * Export metrics in Prometheus format
   */
  exportPrometheusMetrics(): string {
    const lines: string[] = [];

    // Add custom metrics
    this.metrics.forEach((metricArray, metricName) => {
      if (metricArray.length === 0) return;

      const latest = metricArray[metricArray.length - 1];
      const sanitizedName = metricName.replace(/[^a-zA-Z0-9_]/g, '_');

      lines.push(`# HELP ${sanitizedName} ${metricName}`);
      lines.push(`# TYPE ${sanitizedName} gauge`);

      if (latest.labels) {
        const labelPairs = Object.entries(latest.labels)
          .map(([k, v]) => `${k}="${v}"`)
          .join(',');
        lines.push(`${sanitizedName}{${labelPairs}} ${latest.value}`);
      } else {
        lines.push(`${sanitizedName} ${latest.value}`);
      }
    });

    return lines.join('\n');
  }

  /**
   * Get comprehensive performance report
   */
  getPerformanceReport(timeWindow: number = 60 * 60 * 1000): {
    period: string;
    timestamp: string;
    requests: ReturnType<typeof this.getRequestStats>;
    database: ReturnType<typeof this.getDatabaseStats>;
    system: SystemPerformanceData | null;
    alerts: Array<{
      level: 'info' | 'warning' | 'critical';
      message: string;
      metric: string;
      value: number;
    }>;
  } {
    const requests = this.getRequestStats(timeWindow);
    const database = this.getDatabaseStats(timeWindow);
    const system = this.getCurrentSystemStats();

    const alerts: Array<{
      level: 'info' | 'warning' | 'critical';
      message: string;
      metric: string;
      value: number;
    }> = [];

    // Generate alerts based on thresholds
    if (requests.errorRate > 10) {
      alerts.push({
        level: 'critical',
        message: `High error rate: ${requests.errorRate.toFixed(2)}%`,
        metric: 'error_rate',
        value: requests.errorRate
      });
    } else if (requests.errorRate > 5) {
      alerts.push({
        level: 'warning',
        message: `Elevated error rate: ${requests.errorRate.toFixed(2)}%`,
        metric: 'error_rate',
        value: requests.errorRate
      });
    }

    if (requests.averageResponseTime > 2000) {
      alerts.push({
        level: 'critical',
        message: `Very slow average response time: ${requests.averageResponseTime.toFixed(0)}ms`,
        metric: 'avg_response_time',
        value: requests.averageResponseTime
      });
    } else if (requests.averageResponseTime > 1000) {
      alerts.push({
        level: 'warning',
        message: `Slow average response time: ${requests.averageResponseTime.toFixed(0)}ms`,
        metric: 'avg_response_time',
        value: requests.averageResponseTime
      });
    }

    if (database.averageQueryTime > 1000) {
      alerts.push({
        level: 'critical',
        message: `Very slow database queries: ${database.averageQueryTime.toFixed(0)}ms average`,
        metric: 'avg_query_time',
        value: database.averageQueryTime
      });
    } else if (database.averageQueryTime > 500) {
      alerts.push({
        level: 'warning',
        message: `Slow database queries: ${database.averageQueryTime.toFixed(0)}ms average`,
        metric: 'avg_query_time',
        value: database.averageQueryTime
      });
    }

    if (system && system.heapUsage.percentage > 90) {
      alerts.push({
        level: 'critical',
        message: `Critical memory usage: ${system.heapUsage.percentage.toFixed(1)}%`,
        metric: 'heap_usage',
        value: system.heapUsage.percentage
      });
    } else if (system && system.heapUsage.percentage > 80) {
      alerts.push({
        level: 'warning',
        message: `High memory usage: ${system.heapUsage.percentage.toFixed(1)}%`,
        metric: 'heap_usage',
        value: system.heapUsage.percentage
      });
    }

    return {
      period: `${timeWindow / 60000} minutes`,
      timestamp: new Date().toISOString(),
      requests,
      database,
      system,
      alerts
    };
  }
}

export const performanceMonitor = new PerformanceMonitor();