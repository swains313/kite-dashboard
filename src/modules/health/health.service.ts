import {
  DashboardHealthResponse,
  ServiceHealthStatus,
  SystemOverviewHealth,
} from './health.model';

const startTime = Date.now();

export class DashboardHealthService {
  private readonly coreEngineUrl: string;
  private readonly mlServiceUrl: string;

  constructor() {
    this.coreEngineUrl =
      process.env.NEXT_PUBLIC_API_URL ||
      process.env.CORE_ENGINE_URL ||
      'http://localhost:8000';
    this.mlServiceUrl =
      process.env.NEXT_PUBLIC_ML_URL ||
      process.env.ML_SERVICE_URL ||
      'http://localhost:8001';
  }

  public getDashboardHealth(): DashboardHealthResponse {
    return {
      status: 'healthy',
      service: 'kite-dashboard',
      version: '1.0.0',
      uptimeSeconds: Math.floor((Date.now() - startTime) / 1000),
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
    };
  }

  private async probeService(name: string, url: string): Promise<ServiceHealthStatus> {
    const probeStart = Date.now();
    try {
      const response = await fetch(`${url}/health`, {
        method: 'GET',
        cache: 'no-store',
        headers: { Accept: 'application/json' },
        signal: AbortSignal.timeout(3000),
      });

      const latencyMs = Date.now() - probeStart;

      if (!response.ok) {
        return {
          name,
          url,
          status: 'degraded',
          latencyMs,
          error: `HTTP ${response.status} ${response.statusText}`,
        };
      }

      const data = await response.json();
      return {
        name,
        url,
        status: 'healthy',
        latencyMs,
        data,
      };
    } catch (err: unknown) {
      return {
        name,
        url,
        status: 'offline',
        latencyMs: Date.now() - probeStart,
        error: err instanceof Error ? err.message : 'Connection failed',
      };
    }
  }

  public async getSystemOverview(): Promise<SystemOverviewHealth> {
    const dashboard = this.getDashboardHealth();
    const [coreEngine, mlService] = await Promise.all([
      this.probeService('kite-core-engine', this.coreEngineUrl),
      this.probeService('kite-ml-service', this.mlServiceUrl),
    ]);

    return {
      dashboard,
      services: {
        coreEngine,
        mlService,
      },
    };
  }
}

export const dashboardHealthService = new DashboardHealthService();
