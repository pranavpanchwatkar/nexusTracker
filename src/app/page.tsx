import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';

export default async function Home() {
  const session = await getSession();
  
  if (!session) {
    redirect('/login');
  }

  // Smart redirect based on role
  if (session.role === 'admin') {
    redirect('/admin');
  } else if (session.role === 'viewer') {
    redirect('/viewer');
  } else {
    redirect('/coordinator');
  }
}
