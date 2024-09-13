import { DashboardHeader } from '@/components/dashboard-header';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DashboardHeader />
      {children}
    </>
  );
}
