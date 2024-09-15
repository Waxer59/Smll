'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const MODAL_ID = 'modal-layout';

export default function AuthLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();

  useEffect(() => {
    // Detect when the user has clicked outside the modal
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const id = target.id;

      if (id === MODAL_ID) {
        router.replace('/');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div
      id={MODAL_ID}
      className="z-10 fixed top-0 w-full h-full flex flex-col items-center justify-center before:absolute before:w-full before:h-full before:bg-background/50 before:z-0 before:top-0 before:left-0 before:blur-md">
      {children}
    </div>
  );
}
