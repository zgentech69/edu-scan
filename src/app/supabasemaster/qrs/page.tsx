import { cookies } from 'next/headers';
import QRCodesClient from './QRCodesClient';

export const dynamic = 'force-dynamic';

export default function QrCodesPage() {
  const cookieStore = cookies();
  const authCookie = cookieStore.get('admin_session');
  const hodCookie = cookieStore.get('hod_session');
  const expectedToken = process.env.ADMIN_SESSION_SECRET;
  
  const isAdmin = !!(expectedToken && authCookie?.value === expectedToken);
  const isHod = !!hodCookie?.value;

  // Compute allowed division for HODs
  let allowedDivision: string | undefined = undefined;

  if (isHod && !isAdmin && hodCookie.value) {
    const parts = hodCookie.value.split('-');
    // Expected format: 'TE-5-CHEM' or 'SE-3-AIML'
    if (parts.length >= 3) {
      const year = parts[0];
      const branch = parts[2];
      allowedDivision = `${year}-${branch}`;
    } else if (parts[0] === 'FE') {
      allowedDivision = 'FY';
    }
  }

  return <QRCodesClient allowedDivision={allowedDivision} />;
}
