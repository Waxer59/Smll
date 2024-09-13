import { Button } from '@mantine/core';

interface Props {
  children: React.ReactNode;
  onClick?: () => void;
  leftSection?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
}

export const LoginAlternativeButton: React.FC<Props> = ({
  children,
  onClick,
  leftSection,
  ...props
}) => {
  return (
    <Button
      c="gray"
      onClick={onClick}
      leftSection={leftSection}
      className="bg-zinc-800 hover:bg-zinc-700 transition-colors p-3 rounded-md w-full h-full"
      {...props}>
      {children}
    </Button>
  );
};
