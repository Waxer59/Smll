import { EmailVerification } from '@/components/auth/email-verification';
import { UserAuth } from '@/components/auth/user-auth';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard'
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <UserAuth>
      <DashboardHeader />
      <div className="mt-16">{children}</div>
      <EmailVerification />
    </UserAuth>
  );
}
