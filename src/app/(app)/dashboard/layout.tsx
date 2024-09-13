import { DashboardHeader } from '@/components/dashboard-header';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard'
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DashboardHeader />
      {children}
    </>
  );
}
