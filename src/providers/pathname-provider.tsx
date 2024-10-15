'use client';

import { usePathnameStore } from '@/store/pathname';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export const PathnameProvider = ({ children }: any) => {
  const pathname = usePathname();
  const addHistory = usePathnameStore((state) => state.addHistory);

  useEffect(() => {
    console.log(pathname);
    addHistory(pathname);
  }, [addHistory, pathname]);

  return <>{children}</>;
};
