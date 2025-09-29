import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

export interface ErrorMetrics {
  timestamp: string;
  error: string;
  stack?: string;
  url: string;
  method: string;
  userAgent?: string;
  userId?: string;
  sessionId?: string;
  requestId: string;
  statusCode: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface ErrorAlert {
  id: string;
  type: 'error_spike' | 'critical_error' | 'security_breach' | 'system_down';
  message: string;
  timestamp: string;
  metadata: Record<string, any>;
}

class ErrorTracker {
  private errors: ErrorMetrics[] = [];
  private errorCounts: Map<string, number> = new Map();
  private alerts: ErrorAlert[] = [];
  private readonly maxErrors = 1000; // Keep last 1000 errors in memory
  private readonly spikeThreshold = 10; // Errors per minute
  private readonly criticalErrors = [
    'database_connection_failed',
    'authentication_bypass',
    'unauthorized_admin_access',
    'sql_injection_attempt',
    'xss_attempt'
  ];

  async trackError(error: Error | string, request: NextRequest, statusCode: number = 500): Promise<void> {
    const errorMessage = typeof error === 'string' ? error : error.message;
    const stack = typeof error === 'string' ? undefined : error.stack;

    const errorMetric: ErrorMetrics = {
      timestamp: new Date().toISOString(),
      error: errorMessage,
      stack,
      url: request.url,
      method: request.method,
      userAgent: request.headers.get('user-agent') || undefined,
      userId: this.extractUserId(request),
      sessionId: this.extractSessionId(request),
      requestId: request.headers.get('x-request-id') || this.generateRequestId(),
      statusCode,
      severity: this.determineSeverity(errorMessage, statusCode)
    };

    // Add to memory store
    this.errors.push(errorMetric);
    if (this.errors.length > this.maxErrors) {
      this.errors.shift(); // Remove oldest error
    }

    // Track error counts for spike detection
    const errorKey = this.getErrorKey(errorMessage);
    this.errorCounts.set(errorKey, (this.errorCounts.get(errorKey) || 0) + 1);

    // Log the error
    logger.error('Application Error Tracked', {
      ...errorMetric,
      component: 'error-tracker'
    });

    // Check for alerts
    await this.checkForAlerts(errorMetric);

    // Store in persistent storage if critical
    if (errorMetric.severity === 'critical') {
      await this.persistCriticalError(errorMetric);
    }
  }

  private extractUserId(request: NextRequest): string | undefined {
    try {
      const authHeader = request.headers.get('authorization');
      if (authHeader?.startsWith('Bearer ')) {
        // Would decode JWT here in real implementation
        return 'extracted_user_id';
      }
      return undefined;
    } catch {
      return undefined;
    }
  }

  private extractSessionId(request: NextRequest): string | undefined {
    return request.cookies.get('session-id')?.value;
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private determineSeverity(error: string, statusCode: number): ErrorMetrics['severity'] {
    if (this.criticalErrors.some(critical => error.toLowerCase().includes(critical))) {
      return 'critical';
    }

    if (statusCode >= 500) return 'high';
    if (statusCode >= 400) return 'medium';
    return 'low';
  }

  private getErrorKey(error: string): string {
    // Normalize error for grouping similar errors
    return error
      .toLowerCase()
      .replace(/\d+/g, 'N')  // Replace numbers with N
      .replace(/['"]/g, '')  // Remove quotes
      .substring(0, 100);   // Limit length
  }

  private async checkForAlerts(errorMetric: ErrorMetrics): Promise<void> {
    // Check for error spikes
    const recentErrors = this.errors.filter(e =>
      Date.now() - new Date(e.timestamp).getTime() < 60000 // Last minute
    );

    if (recentErrors.length >= this.spikeThreshold) {
      await this.createAlert({
        type: 'error_spike',
        message: `Error spike detected: ${recentErrors.length} errors in the last minute`,
        metadata: { recentErrorCount: recentErrors.length, threshold: this.spikeThreshold }
      });
    }

    // Check for critical errors
    if (errorMetric.severity === 'critical') {
      await this.createAlert({
        type: 'critical_error',
        message: `Critical error detected: ${errorMetric.error}`,
        metadata: { error: errorMetric }
      });
    }

    // Check for security breaches
    if (this.isSecurityBreach(errorMetric.error)) {
      await this.createAlert({
        type: 'security_breach',
        message: `Potential security breach: ${errorMetric.error}`,
        metadata: { error: errorMetric }
      });
    }
  }

  private isSecurityBreach(error: string): boolean {
    const securityKeywords = [
      'sql injection',
      'xss',
      'unauthorized',
      'authentication bypass',
      'privilege escalation',
      'directory traversal'
    ];

    return securityKeywords.some(keyword =>
      error.toLowerCase().includes(keyword)
    );
  }

  private async createAlert(alertData: Omit<ErrorAlert, 'id' | 'timestamp'>): Promise<void> {
    const alert: ErrorAlert = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      ...alertData
    };

    this.alerts.push(alert);

    // Keep only last 100 alerts
    if (this.alerts.length > 100) {
      this.alerts.shift();
    }

    logger.warn('Error Alert Created', {
      alert,
      component: 'error-tracker'
    });

    // In production, this would send notifications via email, Slack, etc.
    await this.sendNotification(alert);
  }

  private async sendNotification(alert: ErrorAlert): Promise<void> {
    // In production, integrate with notification services
    console.warn(`🚨 ALERT [${alert.type}]: ${alert.message}`);

    // Could integrate with:
    // - Email notifications
    // - Slack webhooks
    // - SMS alerts
    // - PagerDuty
    // - Datadog
  }

  private async persistCriticalError(error: ErrorMetrics): Promise<void> {
    // In production, store critical errors in database or external service
    logger.error('Critical Error Persisted', {
      error,
      component: 'error-tracker',
      persistent: true
    });
  }

  // Public API methods
  getRecentErrors(limit: number = 50): ErrorMetrics[] {
    return this.errors.slice(-limit).reverse(); // Most recent first
  }

  getErrorsByTimeRange(startTime: Date, endTime: Date): ErrorMetrics[] {
    return this.errors.filter(error => {
      const errorTime = new Date(error.timestamp);
      return errorTime >= startTime && errorTime <= endTime;
    });
  }

  getErrorStats(): {
    total: number;
    byStatusCode: Record<number, number>;
    bySeverity: Record<string, number>;
    mostCommon: Array<{ error: string; count: number }>;
  } {
    const byStatusCode: Record<number, number> = {};
    const bySeverity: Record<string, number> = {};

    this.errors.forEach(error => {
      byStatusCode[error.statusCode] = (byStatusCode[error.statusCode] || 0) + 1;
      bySeverity[error.severity] = (bySeverity[error.severity] || 0) + 1;
    });

    const mostCommon = Array.from(this.errorCounts.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([error, count]) => ({ error, count }));

    return {
      total: this.errors.length,
      byStatusCode,
      bySeverity,
      mostCommon
    };
  }

  getAlerts(): ErrorAlert[] {
    return this.alerts.slice().reverse(); // Most recent first
  }

  clearOldData(olderThan: Date): void {
    this.errors = this.errors.filter(error =>
      new Date(error.timestamp) > olderThan
    );

    this.alerts = this.alerts.filter(alert =>
      new Date(alert.timestamp) > olderThan
    );
  }

  // Health check
  isHealthy(): boolean {
    const recentErrors = this.errors.filter(error =>
      Date.now() - new Date(error.timestamp).getTime() < 300000 // Last 5 minutes
    );

    const criticalRecentErrors = recentErrors.filter(error =>
      error.severity === 'critical'
    );

    return criticalRecentErrors.length === 0 && recentErrors.length < 20;
  }
}

// Global error tracker instance
export const errorTracker = new ErrorTracker();

// Middleware wrapper
export function withErrorTracking(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (req: NextRequest): Promise<NextResponse> => {
    try {
      return await handler(req);
    } catch (error) {
      await errorTracker.trackError(error as Error, req);

      // Return appropriate error response
      return NextResponse.json(
        {
          type: 'https://tools.ietf.org/html/rfc7231#section-6.6.1',
          title: 'Internal Server Error',
          status: 500,
          detail: 'An unexpected error occurred',
          instance: req.url,
          timestamp: new Date().toISOString()
        },
        { status: 500 }
      );
    }
  };
}

// React error boundary helper
export class ErrorBoundaryTracker {
  static captureError(error: Error, errorInfo: any, componentStack?: string): void {
    // Create a mock request object for client-side errors
    const mockRequest = {
      url: typeof window !== 'undefined' ? window.location.href : 'unknown',
      method: 'GET',
      headers: new Map([
        ['user-agent', typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown']
      ])
    } as unknown as NextRequest;

    errorTracker.trackError(
      new Error(`React Error: ${error.message}\nComponent Stack: ${componentStack}`),
      mockRequest,
      500
    );
  }
}