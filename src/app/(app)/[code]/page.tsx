import { Button, Card, PasswordInput } from '@mantine/core';
import { Send } from 'lucide-react';

export default function Page({
  params: { code }
}: {
  params: { code: string };
}) {
  return (
    <div className="flex items-center justify-center h-screen">
      <Card radius="md" withBorder className="flex flex-col gap-4 p-4">
        <h1 className="text-3xl font-bold">Link protected by password</h1>

        <form className="flex flex-col gap-4 items-center w-full">
          <PasswordInput
            className="w-full"
            label="Password"
            description="Enter the link password"
            placeholder="********"
            name="password"
            size="md"
            radius="md"
            required
          />
          <Button
            className="w-full"
            type="submit"
            variant="light"
            color="gray"
            radius="md"
            size="md"
            leftSection={<Send />}>
            Submit
          </Button>
        </form>
      </Card>
    </div>
  );
}
