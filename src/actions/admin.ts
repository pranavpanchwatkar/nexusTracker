'use server'

import { getSession } from '@/lib/session';
import dbConnect from '@/lib/db';
import { Submission, ProcessedData } from '@/lib/models';
import Papa from 'papaparse';
import { revalidatePath } from 'next/cache';

export async function uploadCSVAction(prevState: any, formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    return { error: 'Unauthorized' };
  }

  const file = formData.get('csvFile') as File;
  if (!file || file.size === 0) return { error: 'No file provided' };

  try {
    const text = await file.text();
    const result = Papa.parse(text, { header: true, skipEmptyLines: true });
    const records: any[] = result.data;
    
    // Helper to find a dynamic column name
    const findValue = (row: any, keywords: string[]) => {
      const key = Object.keys(row).find(k => 
        keywords.some(kw => k.toLowerCase().includes(kw))
      );
      return key ? row[key] : null;
    };

    const validData = records
      .filter((row) => {
        const role = row['Candidate role'] || row.Role || row.role;
        return role && role.toString().toLowerCase().includes('leader');
      })
      .map((row) => ({
        teamId: row['Team ID'] || row.teamId || row.Team || 'Unknown',
        collegeName: row["Candidate's Organisation"] || row['College Name'] || row.collegeName || row['Institute Name'] || row.College || 'Unknown',
        paymentStatus: row['Payment Status'] || row.paymentStatus || row.Payment || 'Pending',
      }));

    if (validData.length === 0) {
      return { error: 'No valid "Leader" rows found. Please check CSV format.' };
    }

    await dbConnect();

    // Replace previous data
    await ProcessedData.deleteMany({});
    await ProcessedData.insertMany(validData);

    revalidatePath('/admin');
    return { success: true, count: validData.length };
  } catch (error: any) {
    console.error(error);
    return { error: 'Failed to process CSV' };
  }
}

export async function getDashboardStats() {
  const session = await getSession();
  if (!session || (session.role !== 'admin' && session.role !== 'viewer')) {
    throw new Error('Unauthorized');
  }

  await dbConnect();
  
  const submissions = await Submission.find({}).lean();
  const processedData = await ProcessedData.find({}).lean();

  return { 
    submissions: JSON.parse(JSON.stringify(submissions)), 
    processedData: JSON.parse(JSON.stringify(processedData)) 
  };
}

export async function getPublicStats() {
  await dbConnect();
  
  const submissions = await Submission.find({}).lean();
  const processedData = await ProcessedData.find({}).lean();

  return { 
    submissions: JSON.parse(JSON.stringify(submissions)), 
    processedData: JSON.parse(JSON.stringify(processedData)) 
  };
}

export async function getFeed() {
  const session = await getSession();
  if (!session || (session.role !== 'admin' && session.role !== 'viewer')) {
    throw new Error('Unauthorized');
  }

  await dbConnect();
  const feed = await Submission.find({}).sort({ timestamp: -1 }).limit(50).lean();
  return JSON.parse(JSON.stringify(feed));
}
