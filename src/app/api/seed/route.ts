import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { User } from '@/lib/models';
import bcrypt from 'bcryptjs';
import { getSession } from '@/lib/session';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();

  try {
    const adminExists = await User.findOne({ role: 'admin' });
    if (adminExists) {
      return NextResponse.json({ message: 'Users already seeded' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('password123', salt);

    await User.insertMany([
      { teamName: 'Admin Team', email: 'admin@nexus.com', password: passwordHash, role: 'admin' },
      { teamName: 'Team A', email: 'teama@nexus.com', password: passwordHash, role: 'coordinator' },
      { teamName: 'Team B', email: 'teamb@nexus.com', password: passwordHash, role: 'coordinator' },
      { teamName: 'Viewer Principal', email: 'principal@nexus.com', password: passwordHash, role: 'viewer' }
    ]);

    return NextResponse.json({ message: 'Initial users seeded!' });
  } catch (error) {
    return NextResponse.json({ error: 'Seeding failed' }, { status: 500 });
  }
}
