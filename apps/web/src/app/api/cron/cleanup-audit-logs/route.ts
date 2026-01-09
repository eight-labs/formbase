import { db } from '@formbase/db';
import { cleanupOldAuditLogs } from '@formbase/api/lib/audit-log';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await cleanupOldAuditLogs(db);
    return Response.json({ success: true, message: 'Audit logs cleaned up' });
  } catch (error) {
    console.error('Failed to cleanup audit logs:', error);
    return Response.json(
      { error: 'Failed to cleanup audit logs' },
      { status: 500 },
    );
  }
}
