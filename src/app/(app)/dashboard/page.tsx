'use client';

import { ShortenedLinks } from '@/components/dashboard/shortened-links';
import { LinksStats } from '@/components/dashboard/links-stats';
import { useLinksStore } from '@/store/links';

export default function Page() {
  const links = useLinksStore((state) => state.links);
  const activeLinks = links.filter((link) => link.isEnabled).length;

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-semibold mb-10">Dashboard</h2>
      <LinksStats
        activeLinks={activeLinks}
        inactiveLinks={links.length - activeLinks}
      />
      <ShortenedLinks links={links} />
    </div>
  );
}
