import { Anchor } from '@mantine/core';
import Link from 'next/link';

interface Props {
  children: React.ReactNode;
  href: string;
}

export const LoginAlternativeAnchor: React.FC<Props> = ({ children, href }) => {
  return (
    <Link href={href} passHref legacyBehavior>
      <Anchor
        c="gray"
        underline="never"
        className="flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 transition-colors p-3 rounded-md w-full">
        {children}
      </Anchor>
    </Link>
  );
};
