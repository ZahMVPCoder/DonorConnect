import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  // Redirect to welcome page for unauthenticated users
  redirect('/welcome');
}
