import { ActionIcon, Avatar, VisuallyHidden } from '@mantine/core';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="bg-neutral-800 py-4">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <h1 className="text-2xl font-medium text-white">Smll</h1>
          <ActionIcon variant="transparent" className="overflow-visible">
            <VisuallyHidden>Account</VisuallyHidden>
            <Avatar name="Hugo Boyano" />
          </ActionIcon>
        </div>
      </header>
      {children}
    </>
  );
}
