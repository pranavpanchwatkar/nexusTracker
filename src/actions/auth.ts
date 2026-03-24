'use server'

import dbConnect from '@/lib/db';
import { User } from '@/lib/models';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function loginAction(prevState: any, formData: FormData) {
  const emailOrTeamId = formData.get('emailOrTeamId') as string;
  const password = formData.get('password') as string;

  if (!emailOrTeamId || !password) {
    return { error: 'Missing fields' };
  }

  await dbConnect();

  console.log("Login attempt with:", { emailOrTeamId, password });

  const user = await User.findOne({ 
    $or: [{ email: emailOrTeamId.trim() }, { teamName: emailOrTeamId.trim() }]
  });

  console.log("Found user:", user ? "YES" : "NO");

  if (!user) {
    return { error: 'Invalid credentials - User not found' };
  }

  const isMatch = await bcrypt.compare(password, user.password);
  console.log("Password match:", isMatch);
  
  if (!isMatch) {
    return { error: 'Invalid credentials - Incorrect password' };
  }

  const token = jwt.sign(
    { id: user._id, role: user.role, teamName: user.teamName },
    process.env.JWT_SECRET || 'supersecret123',
    { expiresIn: '7d' }
  );

  const cookieStore = await cookies();
  cookieStore.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7 // 1 week
  });

  if (user.role === 'admin') {
    redirect('/admin');
  } else if (user.role === 'coordinator') {
    redirect('/coordinator');
  } else {
    redirect('/viewer');
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('token');
  redirect('/login');
}

export async function changePasswordAction(prevState: any, formData: FormData) {
  const currentPassword = formData.get('currentPassword') as string;
  const newPassword = formData.get('newPassword') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { error: 'Missing fields' };
  }

  if (newPassword !== confirmPassword) {
    return { error: 'New passwords do not match' };
  }

  if (newPassword.length < 6) {
    return { error: 'New password must be at least 6 characters' };
  }

  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  if (!token) return { error: 'Not authenticated' };

  let decoded: any;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecret123');
  } catch (err) {
    return { error: 'Invalid session' };
  }

  await dbConnect();
  const user = await User.findById(decoded.id);
  if (!user) return { error: 'User not found' };

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) return { error: 'Current password is incorrect' };

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(newPassword, salt);

  user.password = passwordHash;
  await user.save();

  return { success: 'Password updated successfully!' };
}
