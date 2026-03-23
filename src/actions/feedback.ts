'use server';

import dbConnect from '@/lib/db';
import { Feedback } from '@/lib/models';
import { getSession } from '@/lib/session';
import { revalidatePath } from 'next/cache';

export async function submitFeedbackAction(prevState: any, formData: FormData) {
  try {
    const session = await getSession();
    const email = session?.email || 'Anonymous';
    const message = formData.get('message') as string;

    if (!message || message.length < 5) {
      return { error: 'Feedback must be at least 5 characters long.' };
    }

    await dbConnect();
    await Feedback.create({
      email,
      message,
      timestamp: new Date()
    });

    revalidatePath('/admin');
    return { success: true, error: null };
  } catch (error: any) {
    console.error('Feedback Error:', error);
    return { error: 'Failed to submit feedback. Please try again later.' };
  }
}

export async function getFeedbacks() {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    throw new Error('Unauthorized');
  }

  await dbConnect();
  const feedbacks = await Feedback.find({}).sort({ timestamp: -1 }).lean();
  return JSON.parse(JSON.stringify(feedbacks));
}
