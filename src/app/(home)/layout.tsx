import React from 'react';

export default function HomeLayout({
  children,
  auth
}: {
  children: React.ReactNode;
  auth: React.ReactNode;
}) {
  return (
    <>
      {children}
      {auth}
    </>
  );
}
