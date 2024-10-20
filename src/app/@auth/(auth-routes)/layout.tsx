'use client';

import { usePathnameStore } from '@/store/pathname';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const MODAL_ID = 'modal-layout';

export default function AuthLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const history = usePathnameStore((state) => state.history);
  const getPreviousPathname = usePathnameStore(
    (state) => state.getPreviousPathname
  );
  const addHistory = usePathnameStore((state) => state.addHistory);
  const [isPreviousPathnameRoot, setIsPreviousPathnameRoot] =
    useState<boolean>(false);

  useEffect(() => {
    if (!isPreviousPathnameRoot) return;

    // Detect when the user has clicked outside the modal
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const id = target.id;

      if (id === MODAL_ID) {
        router.replace('/');
        addHistory('/');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [addHistory, isPreviousPathnameRoot, router]);

  useEffect(() => {
    if (getPreviousPathname() === '/') {
      setIsPreviousPathnameRoot(true);
    }
  }, [getPreviousPathname, history]);

  return (
    <div
      id={MODAL_ID}
      className={`z-10 fixed top-0 w-full h-full flex flex-col items-center justify-center before:absolute before:w-full before:h-full before:bg-background${isPreviousPathnameRoot ? '/50' : ''} before:z-0 before:top-0 before:left-0 before:blur-md`}>
      {children}
    </div>
  );
}
