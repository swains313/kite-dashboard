export interface ServiceHealthStatus {
  name: string;
  url: string;
  status: 'healthy' | 'degraded' | 'offline' | 'checking';
  latencyMs?: number;
  data?: Record<string, unknown>;
  error?: string;
}

export interface DashboardHealthResponse {
  status: 'healthy' | 'degraded' | 'offline';
  service: string;
  version: string;
  uptimeSeconds: number;
  timestamp: string;
  environment: string;
}

export interface SystemOverviewHealth {
  dashboard: DashboardHealthResponse;
  services: {
    coreEngine: ServiceHealthStatus;
    mlService: ServiceHealthStatus;
  };
}
