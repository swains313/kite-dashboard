import { NextResponse } from 'next/server';
import { dashboardHealthService } from './health.service';

export class DashboardHealthController {
  public static async getHealth(overview: boolean = false): Promise<NextResponse> {
    try {
      if (overview) {
        const fullStatus = await dashboardHealthService.getSystemOverview();
        return NextResponse.json(fullStatus, { status: 200 });
      }

      const health = dashboardHealthService.getDashboardHealth();
      return NextResponse.json(health, { status: 200 });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Internal error';
      return NextResponse.json(
        {
          status: 'offline',
          service: 'kite-dashboard',
          error: message,
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      );
    }
  }
}
