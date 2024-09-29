import { Button, Card } from '@mantine/core';

export const IntegrationsSettingsCard = () => {
  return (
    <Card
      className="flex flex-col gap-8 items-center w-full"
      radius="md"
      shadow="sm"
      withBorder>
      <h2 className="text-3xl font-bold">Integrations</h2>
      {/* <ul className='w-full'>
      </ul> */}
      <Button
        variant="light"
        color="gray"
        radius="md"
        size="md"
        className="w-full">
        Create token
      </Button>
    </Card>
  );
};
