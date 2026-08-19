import { cookies } from 'next/headers';
import SettingsClient from './SettingsClient';

export default function SettingsPage() {
  const hodCookie = cookies().get('hod_session');
  const branchId = hodCookie?.value;

  return <SettingsClient branchId={branchId} />;
}
