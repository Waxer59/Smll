import { ShortenedLinks } from '@/components/dashboard/shortened-links';
import { LinksStats } from '@/components/dashboard/links-stats';

export default function Page() {
  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-semibold mb-10">Dashboard</h2>
      <LinksStats activeLinks={10} inactiveLinks={12} />
      <ShortenedLinks />
    </div>
  );
}
