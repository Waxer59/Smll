import { Anchor } from '@mantine/core';
import { forwardRef } from 'react';

interface Props {
  children: React.ReactNode;
  href?: string;
}

export const LoginAlternativeAnchor = forwardRef<HTMLAnchorElement, Props>(
  ({ children, href }: Props, ref) => {
    return (
      <Anchor
        c="gray"
        href={href}
        ref={ref}
        underline="never"
        className="flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 transition-colors p-3 rounded-md w-full">
        {children}
      </Anchor>
    );
  }
);

LoginAlternativeAnchor.displayName = 'LoginAlternativeAnchor';
