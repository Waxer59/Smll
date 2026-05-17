import { Card } from '@mantine/core';

export const LoadingLink = () => {
  return (
    <Card
      radius="md"
      padding="sm"
      className="flex flex-col justify-center h-full gap-6 overflow-auto link-card w-full animate-pulse duration-10000"></Card>
  );
};
