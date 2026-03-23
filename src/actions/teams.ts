'use server';

import dbConnect from '@/lib/db';
import { User } from '@/lib/models';
import bcrypt from 'bcryptjs';
import { getSession } from '@/lib/session';
import { revalidatePath } from 'next/cache';

export async function createTeamAction(prevState: any, formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== 'admin') return { error: 'Unauthorized' };

  const teamName = formData.get('teamName') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const collegesStr = formData.get('colleges') as string;

  if (!teamName || !email || !password) return { error: 'Missing required fields' };

  const allottedColleges = collegesStr ? collegesStr.split('\n').map((c: string) => c.trim()).filter(Boolean) : [];

  await dbConnect();
  
  const existing = await User.findOne({ email });
  if (existing) return { error: 'Email already exists' };

  try {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    await User.create({
      teamName,
      email,
      password: passwordHash,
      role: 'coordinator',
      allottedColleges
    });

    revalidatePath('/admin');
    return { success: true };
  } catch (e: any) {
    return { error: 'Failed to create team: ' + e.message };
  }
}

export async function updateTeamAction(prevState: any, formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== 'admin') return { error: 'Unauthorized' };

  const teamId = formData.get('teamId') as string;
  const teamName = formData.get('teamName') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const collegesStr = formData.get('colleges') as string;

  if (!teamId || !teamName || !email) return { error: 'Missing required fields' };

  const allottedColleges = collegesStr ? collegesStr.split('\n').map((c: string) => c.trim()).filter(Boolean) : [];

  await dbConnect();
  
  const updateData: any = { teamName, email, allottedColleges };

  if (password) {
    const salt = await bcrypt.genSalt(10);
    updateData.password = await bcrypt.hash(password, salt);
  }

  try {
    await User.findByIdAndUpdate(teamId, updateData);
    revalidatePath('/admin');
    return { success: true };
  } catch (e: any) {
    return { error: 'Failed to update team: ' + e.message };
  }
}

export async function deleteTeamAction(formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== 'admin') return { error: 'Unauthorized' };

  const teamId = formData.get('teamId') as string;
  if (!teamId) return { error: 'Missing team ID' };

  await dbConnect();
  
  try {
    await User.findByIdAndDelete(teamId);
    revalidatePath('/admin');
    return { success: true };
  } catch (e: any) {
    return { error: 'Failed to delete team: ' + e.message };
  }
}
