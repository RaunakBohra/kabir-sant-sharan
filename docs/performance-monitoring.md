# Performance Monitoring System

The Kabir Sant Sharan platform includes a comprehensive performance monitoring system that tracks request performance, database operations, system metrics, and provides real-time insights through an admin dashboard.

## Features

### 1. Request Performance Tracking
- **Response Times**: Track average, min, max, and percentiles (50th, 90th, 95th, 99th)
- **Error Rates**: Monitor HTTP error rates and status code distribution
- **Throughput**: Track requests per second
- **Slow Request Detection**: Automatic alerts for slow endpoints
- **Top Slow Endpoints**: Identify performance bottlenecks

### 2. Database Performance Monitoring
- **Query Times**: Track database operation duration
- **Slow Query Detection**: Automatic logging of slow database operations
- **Cache Hit Rates**: Monitor database query caching effectiveness
- **Operation Breakdown**: Track performance by operation type (SELECT, INSERT, etc.)

### 3. System Metrics
- **Memory Usage**: Heap and total memory consumption
- **CPU Usage**: Process CPU utilization
- **Active Connections**: Real-time connection monitoring
- **Resource Alerts**: Automatic warnings for high resource usage

### 4. Real-time Dashboard
- **Live Metrics**: Real-time performance data with auto-refresh
- **Time Window Selection**: View metrics for different time periods (5 min to 24 hours)
- **Performance Alerts**: Visual alerts for critical performance issues
- **Detailed Statistics**: Comprehensive breakdowns and top offenders

### 5. Prometheus Integration
- **Metrics Export**: Export metrics in Prometheus format
- **External Monitoring**: Integration with external monitoring tools
- **Custom Metrics**: Support for application-specific metrics

## API Endpoints

### Get Performance Metrics
```
GET /api/v1/performance?timeWindow=3600000&format=json
```

**Parameters:**
- `timeWindow`: Time window in milliseconds (60000 to 86400000)
- `format`: Response format (`json` or `prometheus`)
- `metric`: Specific metric name to retrieve

**Response:**
```json
{
  "timestamp": "2024-01-01T00:00:00.000Z",
  "timeWindow": "3600s",
  "report": {
    "requests": {
      "totalRequests": 1250,
      "averageResponseTime": 145.5,
      "errorRate": 2.3,
      "requestsPerSecond": 0.35,
      "slowRequestsCount": 5,
      "statusCodeDistribution": {
        "2xx": 1210,
        "4xx": 25,
        "5xx": 15
      },
      "topSlowEndpoints": [...]
    },
    "database": {
      "totalQueries": 3450,
      "averageQueryTime": 12.5,
      "slowQueriesCount": 8,
      "cacheHitRate": 85.2,
      "topSlowQueries": [...]
    },
    "system": {
      "cpuUsage": 0.15,
      "memoryUsage": {
        "used": 134217728,
        "total": 268435456,
        "percentage": 50.0
      },
      "heapUsage": {
        "used": 67108864,
        "total": 134217728,
        "percentage": 50.0
      },
      "activeConnections": 12
    },
    "alerts": [
      {
        "level": "warning",
        "message": "Elevated error rate: 2.3%",
        "metric": "error_rate",
        "value": 2.3
      }
    ]
  }
}
```

### Get Live Performance Data
```
GET /api/v1/performance/live?include=all
```

**Parameters:**
- `include`: What to include (`system`, `requests`, `database`, `all`)

## Implementation

### 1. Automatic Request Tracking

Wrap API route handlers with performance tracking middleware:

```typescript
import { withPerformanceTracking } from '@/lib/middleware/performance-middleware';

async function apiHandler(request: NextRequest) {
  // Your API logic here
}

export const POST = withPerformanceTracking(apiHandler, {
  trackRequests: true,
  trackDatabase: true,
  logSlowRequests: true,
  slowRequestThreshold: 1000
});
```

### 2. Database Operation Tracking

Track database operations manually:

```typescript
import { trackDatabaseOperation } from '@/lib/middleware/performance-middleware';

async function queryUsers() {
  const tracker = trackDatabaseOperation('SELECT', 'users');

  try {
    const users = await db.prepare('SELECT * FROM users').all();
    tracker.complete({ rows: users.length, cached: false });
    return users;
  } catch (error) {
    tracker.complete({ rows: 0 });
    throw error;
  }
}
```

### 3. Custom Metrics

Record custom application metrics:

```typescript
import { performanceMonitor } from '@/lib/monitoring/performance-monitor';

// Record a custom metric
performanceMonitor.recordMetric({
  name: 'user_registration_time',
  value: 250,
  unit: 'ms',
  labels: {
    source: 'web',
    plan: 'free'
  },
  context: {
    userId: 'user123',
    success: true
  }
});
```

### 4. Method Decoration

Use decorators for automatic method performance tracking:

```typescript
import { PerformanceTracked } from '@/lib/middleware/performance-middleware';

class UserService {
  @PerformanceTracked('user_service_create_user')
  async createUser(userData: any) {
    // Method implementation
  }
}
```

## Configuration

### Environment Variables

```bash
# Performance monitoring settings
PERFORMANCE_ENABLED=true
PERFORMANCE_RETENTION_HOURS=24
PERFORMANCE_MAX_METRICS=1000

# Alert thresholds
PERFORMANCE_SLOW_REQUEST_THRESHOLD=1000
PERFORMANCE_SLOW_QUERY_THRESHOLD=500
PERFORMANCE_ERROR_RATE_THRESHOLD=5
PERFORMANCE_MEMORY_THRESHOLD=85
```

### Alert Thresholds

The system automatically generates alerts based on these thresholds:

**Request Performance:**
- Warning: >1000ms average response time, >5% error rate
- Critical: >2000ms average response time, >10% error rate

**Database Performance:**
- Warning: >500ms average query time
- Critical: >1000ms average query time

**System Resources:**
- Warning: >80% memory usage
- Critical: >90% memory usage

## Admin Dashboard

Access the performance monitoring dashboard at `/admin/performance`.

### Dashboard Features

1. **Live System Health**
   - Real-time memory and CPU usage
   - Active connections count
   - Visual progress bars with color-coded thresholds

2. **Request Performance (5-minute window)**
   - Total requests and requests per second
   - Average response time with color-coded warnings
   - Error rate monitoring

3. **Database Performance (5-minute window)**
   - Total queries and average query time
   - Slow query count
   - Cache hit rate percentage

4. **Historical Statistics**
   - Configurable time windows (5 minutes to 24 hours)
   - Status code distribution
   - Top slowest endpoints and database operations

5. **Performance Alerts**
   - Real-time alerts with severity levels
   - Alert history and trending

### Dashboard Controls

- **Auto Refresh**: Toggle automatic refresh every 30 seconds
- **Time Window**: Select historical data period
- **Manual Refresh**: Force immediate data update

## Prometheus Integration

Export metrics in Prometheus format:

```
GET /api/v1/performance?format=prometheus
```

Example Prometheus metrics output:
```
# HELP http_request_duration HTTP request duration in milliseconds
# TYPE http_request_duration gauge
http_request_duration{method="POST",path="/api/auth/login",status="200"} 145.5

# HELP database_query_duration Database query duration in milliseconds
# TYPE database_query_duration gauge
database_query_duration{operation="SELECT",table="users",cached="false"} 12.5

# HELP memory_usage_percentage Memory usage percentage
# TYPE memory_usage_percentage gauge
memory_usage_percentage 50.0
```

## Monitoring Best Practices

1. **Set Appropriate Thresholds**
   - Configure alert thresholds based on your application's normal performance
   - Adjust thresholds during high-traffic periods

2. **Monitor Key Endpoints**
   - Focus on critical user journeys (authentication, content loading)
   - Track API endpoints with external dependencies

3. **Database Optimization**
   - Monitor slow queries and optimize them
   - Track cache hit rates and improve caching strategies

4. **Resource Management**
   - Monitor memory leaks and heap growth
   - Track connection pools and cleanup

5. **Alert Fatigue Prevention**
   - Set reasonable alert thresholds
   - Group related alerts
   - Implement alert escalation

## Integration with External Tools

The performance monitoring system can be integrated with:

- **Prometheus**: Metrics scraping and storage
- **Grafana**: Advanced dashboards and visualization
- **PagerDuty**: Alert management and escalation
- **Slack**: Real-time alert notifications
- **DataDog**: APM and infrastructure monitoring

## Troubleshooting

### Common Issues

1. **High Memory Usage**
   - Check for memory leaks in application code
   - Review metrics retention settings
   - Implement proper cleanup intervals

2. **Slow Database Queries**
   - Review database indexes
   - Implement query optimization
   - Consider read replicas for heavy read workloads

3. **High Error Rates**
   - Check application logs for error patterns
   - Review external service dependencies
   - Implement proper error handling and retries

### Performance Impact

The monitoring system is designed to have minimal performance impact:

- **Memory**: ~10MB for metric storage
- **CPU**: <1% overhead for metric collection
- **Storage**: Configurable retention (default 24 hours)

## Security Considerations

- Performance metrics are only accessible to admin users
- API endpoints require admin authentication
- Sensitive data is not included in performance metrics
- Request tracking excludes sensitive headers and body content