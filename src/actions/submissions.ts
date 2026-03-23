'use server';

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSession } from '@/lib/session';
import dbConnect from '@/lib/db';
import { Submission } from '@/lib/models';
import crypto from 'crypto';
import { revalidatePath } from 'next/cache';

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  }
});

export async function createSubmission(prevState: any, formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== 'coordinator') {
    return { error: 'Unauthorized' };
  }

  const collegeName = formData.get('collegeName') as string;
  const approachedCount = parseInt(formData.get('approachedCount') as string);
  const image = formData.get('image') as File;

  if (!collegeName || isNaN(approachedCount) || !image || image.size === 0) {
    return { error: 'All fields are required' };
  }

  try {
    const buffer = Buffer.from(await image.arrayBuffer());
    const ext = image.name.split('.').pop();
    const fileName = `${session.teamName.replace(/\s+/g, '-')}-${Date.now()}-${crypto.randomBytes(4).toString('hex')}.${ext}`;
    
    let imageUrl = '';
    if (process.env.AWS_S3_BUCKET_NAME && process.env.AWS_ACCESS_KEY_ID) {
      await s3Client.send(new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: fileName,
        Body: buffer,
        ContentType: image.type,
      }));
      // Use internal proxy route to display images from private buckets
      imageUrl = `/api/image?key=${encodeURIComponent(fileName)}`;
    } else {
      imageUrl = `https://dummyimage.com/600x400/262626/ffffff&text=${encodeURIComponent(fileName)}`;
    }

    await dbConnect();
    const sub = await Submission.create({
      teamName: session.teamName,
      collegeName,
      approachedCount,
      imageUrl
    });

    revalidatePath('/admin');
    revalidatePath('/coordinator');
    return { success: true, submission: JSON.parse(JSON.stringify(sub)) };
  } catch (error: any) {
    console.error("S3/Mongo Error Details:", error);
    return { error: 'Failed: ' + error.message };
  }
}
