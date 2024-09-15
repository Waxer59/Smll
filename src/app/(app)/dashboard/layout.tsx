import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { FirstTimeUser } from '@/components/dashboard/first-time-user';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard'
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DashboardHeader />
      <div className="mt-16">{children}</div>
      <FirstTimeUser />
    </>
  );
}
