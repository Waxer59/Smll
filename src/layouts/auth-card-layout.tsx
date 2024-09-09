import { Card } from '@mantine/core';

interface Props {
  children: React.ReactNode;
  title: string;
}

export const AuthCardLayout: React.FC<Props> = ({ children, title }) => {
  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      className="max-w-[350px] w-[90%]">
      <h1 className="text-center text-3xl font-bold">{title}</h1>
      {children}
    </Card>
  );
};
