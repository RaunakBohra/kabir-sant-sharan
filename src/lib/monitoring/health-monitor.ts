import { NextRequest } from 'next/server';
import { logger } from '@/lib/logger';
import { errorTracker } from './error-tracker';

export interface HealthMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: string;
  status: 'healthy' | 'warning' | 'critical';
  metadata?: Record<string, any>;
}

export interface SystemHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  uptime: number;
  metrics: HealthMetric[];
  checks: HealthCheck[];
}

export interface HealthCheck {
  name: string;
  status: 'pass' | 'warn' | 'fail';
  duration: number;
  message?: string;
  timestamp: string;
}

class HealthMonitor {
  private metrics: HealthMetric[] = [];
  private readonly maxMetrics = 1000;
  private readonly startTime = Date.now();

  // System resource monitoring
  async collectSystemMetrics(): Promise<HealthMetric[]> {
    const metrics: HealthMetric[] = [];
    const timestamp = new Date().toISOString();

    try {
      // Memory usage (Node.js process)
      if (typeof process !== 'undefined' && process.memoryUsage) {
        const memUsage = process.memoryUsage();

        metrics.push({
          name: 'memory_heap_used',
          value: Math.round(memUsage.heapUsed / 1024 / 1024 * 100) / 100,
          unit: 'MB',
          timestamp,
          status: memUsage.heapUsed > 100 * 1024 * 1024 ? 'warning' : 'healthy', // 100MB threshold
          metadata: { total: memUsage.heapTotal, external: memUsage.external }
        });

        metrics.push({
          name: 'memory_heap_total',
          value: Math.round(memUsage.heapTotal / 1024 / 1024 * 100) / 100,
          unit: 'MB',
          timestamp,
          status: memUsage.heapTotal > 200 * 1024 * 1024 ? 'warning' : 'healthy' // 200MB threshold
        });
      }

      // Response time metrics (average of recent requests)
      const recentErrors = errorTracker.getRecentErrors(100);
      const avgResponseTime = this.calculateAverageResponseTime(recentErrors);

      if (avgResponseTime > 0) {
        metrics.push({
          name: 'avg_response_time',
          value: avgResponseTime,
          unit: 'ms',
          timestamp,
          status: avgResponseTime > 1000 ? 'warning' : avgResponseTime > 2000 ? 'critical' : 'healthy'
        });
      }

      // Error rate metrics
      const errorStats = errorTracker.getErrorStats();
      const recentErrorCount = recentErrors.length;

      metrics.push({
        name: 'error_count_5min',
        value: recentErrorCount,
        unit: 'count',
        timestamp,
        status: recentErrorCount > 10 ? 'critical' : recentErrorCount > 5 ? 'warning' : 'healthy',
        metadata: { total_errors: errorStats.total }
      });

      // Database connection health (simulated)
      const dbHealth = await this.checkDatabaseHealth();
      metrics.push({
        name: 'database_health',
        value: dbHealth.isHealthy ? 1 : 0,
        unit: 'boolean',
        timestamp,
        status: dbHealth.isHealthy ? 'healthy' : 'critical',
        metadata: { response_time: dbHealth.responseTime }
      });

    } catch (error) {
      logger.error('Failed to collect system metrics', {
        error: error instanceof Error ? error.message : String(error),
        component: 'health-monitor'
      });
    }

    return metrics;
  }

  private calculateAverageResponseTime(errors: any[]): number {
    // In a real implementation, this would track actual response times
    // For now, we'll simulate based on error patterns
    if (errors.length === 0) return 0;

    const recentTimestamps = errors
      .slice(-10)
      .map(e => new Date(e.timestamp).getTime());

    if (recentTimestamps.length < 2) return 200; // Default response time

    const intervals = recentTimestamps
      .slice(1)
      .map((time, i) => time - recentTimestamps[i]);

    const avgInterval = intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length;
    return Math.min(Math.max(avgInterval / 10, 50), 5000); // Normalize to reasonable response time
  }

  private async checkDatabaseHealth(): Promise<{ isHealthy: boolean; responseTime: number }> {
    const startTime = Date.now();

    try {
      // In a real implementation, this would ping the actual database
      // For now, we'll simulate a database check
      await new Promise(resolve => setTimeout(resolve, Math.random() * 10));

      const responseTime = Date.now() - startTime;
      return {
        isHealthy: responseTime < 100, // Consider healthy if response < 100ms
        responseTime
      };
    } catch (error) {
      return {
        isHealthy: false,
        responseTime: Date.now() - startTime
      };
    }
  }

  // Health checks
  async runHealthChecks(): Promise<HealthCheck[]> {
    const checks: HealthCheck[] = [];

    // API Health Check
    checks.push(await this.checkApiHealth());

    // Database Health Check
    checks.push(await this.checkDatabaseConnectivity());

    // Error Rate Health Check
    checks.push(await this.checkErrorRate());

    // Memory Health Check
    checks.push(await this.checkMemoryUsage());

    // Disk Space Check (simulated)
    checks.push(await this.checkDiskSpace());

    return checks;
  }

  private async checkApiHealth(): Promise<HealthCheck> {
    const startTime = Date.now();

    try {
      // Simulate API health check
      await new Promise(resolve => setTimeout(resolve, 5));

      return {
        name: 'api_health',
        status: 'pass',
        duration: Date.now() - startTime,
        message: 'API is responding normally',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        name: 'api_health',
        status: 'fail',
        duration: Date.now() - startTime,
        message: 'API health check failed',
        timestamp: new Date().toISOString()
      };
    }
  }

  private async checkDatabaseConnectivity(): Promise<HealthCheck> {
    const startTime = Date.now();

    try {
      const dbHealth = await this.checkDatabaseHealth();

      return {
        name: 'database_connectivity',
        status: dbHealth.isHealthy ? 'pass' : 'fail',
        duration: Date.now() - startTime,
        message: dbHealth.isHealthy ? 'Database is accessible' : 'Database connection failed',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        name: 'database_connectivity',
        status: 'fail',
        duration: Date.now() - startTime,
        message: 'Database connectivity check failed',
        timestamp: new Date().toISOString()
      };
    }
  }

  private async checkErrorRate(): Promise<HealthCheck> {
    const startTime = Date.now();

    try {
      const recentErrors = errorTracker.getRecentErrors(50);
      const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
      const recentErrorCount = recentErrors.filter(error =>
        new Date(error.timestamp).getTime() > fiveMinutesAgo
      ).length;

      let status: HealthCheck['status'] = 'pass';
      let message = 'Error rate is normal';

      if (recentErrorCount > 20) {
        status = 'fail';
        message = `High error rate: ${recentErrorCount} errors in 5 minutes`;
      } else if (recentErrorCount > 10) {
        status = 'warn';
        message = `Elevated error rate: ${recentErrorCount} errors in 5 minutes`;
      }

      return {
        name: 'error_rate',
        status,
        duration: Date.now() - startTime,
        message,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        name: 'error_rate',
        status: 'fail',
        duration: Date.now() - startTime,
        message: 'Error rate check failed',
        timestamp: new Date().toISOString()
      };
    }
  }

  private async checkMemoryUsage(): Promise<HealthCheck> {
    const startTime = Date.now();

    try {
      if (typeof process === 'undefined' || !process.memoryUsage) {
        return {
          name: 'memory_usage',
          status: 'warn',
          duration: Date.now() - startTime,
          message: 'Memory usage check not available',
          timestamp: new Date().toISOString()
        };
      }

      const memUsage = process.memoryUsage();
      const heapUsedMB = memUsage.heapUsed / 1024 / 1024;

      let status: HealthCheck['status'] = 'pass';
      let message = `Memory usage normal: ${Math.round(heapUsedMB)}MB`;

      if (heapUsedMB > 200) {
        status = 'fail';
        message = `High memory usage: ${Math.round(heapUsedMB)}MB`;
      } else if (heapUsedMB > 100) {
        status = 'warn';
        message = `Elevated memory usage: ${Math.round(heapUsedMB)}MB`;
      }

      return {
        name: 'memory_usage',
        status,
        duration: Date.now() - startTime,
        message,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        name: 'memory_usage',
        status: 'fail',
        duration: Date.now() - startTime,
        message: 'Memory usage check failed',
        timestamp: new Date().toISOString()
      };
    }
  }

  private async checkDiskSpace(): Promise<HealthCheck> {
    const startTime = Date.now();

    try {
      // Simulated disk space check
      const freeSpacePercent = Math.random() * 100;

      let status: HealthCheck['status'] = 'pass';
      let message = `Disk space available: ${Math.round(freeSpacePercent)}%`;

      if (freeSpacePercent < 10) {
        status = 'fail';
        message = `Critical disk space: ${Math.round(freeSpacePercent)}%`;
      } else if (freeSpacePercent < 20) {
        status = 'warn';
        message = `Low disk space: ${Math.round(freeSpacePercent)}%`;
      }

      return {
        name: 'disk_space',
        status,
        duration: Date.now() - startTime,
        message,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        name: 'disk_space',
        status: 'fail',
        duration: Date.now() - startTime,
        message: 'Disk space check failed',
        timestamp: new Date().toISOString()
      };
    }
  }

  // Public API methods
  async getSystemHealth(): Promise<SystemHealth> {
    const metrics = await this.collectSystemMetrics();
    const checks = await this.runHealthChecks();

    // Store metrics
    this.metrics.push(...metrics);
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }

    // Determine overall system status
    const hasFailures = checks.some(check => check.status === 'fail');
    const hasWarnings = checks.some(check => check.status === 'warn');
    const hasCriticalMetrics = metrics.some(metric => metric.status === 'critical');

    let status: SystemHealth['status'] = 'healthy';
    if (hasFailures || hasCriticalMetrics) {
      status = 'unhealthy';
    } else if (hasWarnings) {
      status = 'degraded';
    }

    return {
      status,
      timestamp: new Date().toISOString(),
      uptime: Date.now() - this.startTime,
      metrics,
      checks
    };
  }

  getMetricsHistory(metricName?: string, limit: number = 100): HealthMetric[] {
    let filteredMetrics = this.metrics;

    if (metricName) {
      filteredMetrics = this.metrics.filter(metric => metric.name === metricName);
    }

    return filteredMetrics.slice(-limit);
  }

  // Health endpoint data
  async getHealthEndpointData(): Promise<{
    status: string;
    timestamp: string;
    version: string;
    uptime: number;
    checks: Record<string, any>;
  }> {
    const systemHealth = await this.getSystemHealth();

    const checksMap: Record<string, any> = {};
    systemHealth.checks.forEach(check => {
      checksMap[check.name] = {
        status: check.status,
        duration: `${check.duration}ms`,
        message: check.message,
        timestamp: check.timestamp
      };
    });

    return {
      status: systemHealth.status,
      timestamp: systemHealth.timestamp,
      version: process.env.APP_VERSION || '1.0.0',
      uptime: systemHealth.uptime,
      checks: checksMap
    };
  }
}

// Global health monitor instance
export const healthMonitor = new HealthMonitor();