import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default function QrsLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies();
  const authCookie = cookieStore.get('admin_session');
  const expectedToken = process.env.ADMIN_SESSION_SECRET;
  
  if (!expectedToken || !authCookie?.value || authCookie.value !== expectedToken) {
    redirect('/supabasemaster');
  }

  return <>{children}</>;
}
