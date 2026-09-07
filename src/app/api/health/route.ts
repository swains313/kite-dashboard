import { NextRequest } from 'next/server';
import { DashboardHealthController } from '@/modules/health/health.controller';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const overview = searchParams.get('overview') === 'true';
  return DashboardHealthController.getHealth(overview);
}
