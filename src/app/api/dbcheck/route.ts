import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const r = await db.query<{ now: string; user: string; db: string }>(
      'select now() as now, current_user as "user", current_database() as db'
    );
    return NextResponse.json({ ok: true, result: r.rows[0] });
  } catch (e) {
    const err = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ ok: false, error: err }, { status: 500 });
  }
}
