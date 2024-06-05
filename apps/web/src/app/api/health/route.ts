import { db, drizzlePrimitives } from '@formbase/db';

export async function GET() {
  try {
    await db.execute(drizzlePrimitives.sql`SELECT 1000`);

    return new Response('All systems operational', { status: 200 });
  } catch (err) {
    return new Response(`An error occured`, { status: 500 });
  }
}
