import { EmailVerification } from '@/components/auth/email-verification';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { UserAuthProvider } from '@/providers/user-auth-provider';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard'
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <UserAuthProvider>
      <DashboardHeader />
      <div className="mt-16">{children}</div>
      <EmailVerification />
    </UserAuthProvider>
  );
}
