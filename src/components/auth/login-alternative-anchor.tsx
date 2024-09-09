import { Anchor } from '@mantine/core';

interface Props {
  children: React.ReactNode;
  href?: string;
}

export const LoginAlternativeAnchor: React.FC<Props> = ({ children, href }) => {
  return (
    <Anchor
      c="gray"
      href={href}
      underline="never"
      className="flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 transition-colors p-3 rounded-md w-full">
      {children}
    </Anchor>
  );
};
