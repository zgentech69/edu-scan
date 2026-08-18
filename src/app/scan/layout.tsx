import { AnnouncementBanner } from '@/components/AnnouncementBanner';

export default function ScanLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <AnnouncementBanner />
      {children}
    </div>
  );
}
