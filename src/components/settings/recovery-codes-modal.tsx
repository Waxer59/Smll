'use client';

/* eslint-disable react/no-unescaped-entities */
import {
  ActionIcon,
  Button,
  Modal,
  Tooltip,
  VisuallyHidden
} from '@mantine/core';
import { Check, Clipboard } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  recoveryCodes: string[];
}

export const RecoveryCodesModal: React.FC<Props> = ({
  isOpen,
  onClose,
  recoveryCodes
}) => {
  const handleCopyCodes = () => {
    navigator.clipboard.writeText(recoveryCodes.join('\n'));
    toast.success('Recovery codes copied to clipboard.');
  };

  return (
    <Modal
      onClose={onClose}
      opened={isOpen}
      withCloseButton={false}
      title="MFA"
      radius="md"
      shadow="sm">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <h2 className="text-3xl font-bold">Recovery codes</h2>
          <p>
            These are the recovery codes for your MFA account. Save them in a
            safe place, and don't share them with anyone. These codes can only
            be generated once.
          </p>
        </div>

        <div className="relative">
          <ul className="flex flex-col gap-4 bg-neutral-900 p-4 rounded-md">
            {recoveryCodes.map((code) => (
              <li key={code}>{code}</li>
            ))}
          </ul>

          <Tooltip label="Copy codes" color="dark">
            <ActionIcon
              variant="light"
              color="gray"
              radius="md"
              size="lg"
              className="absolute right-2 top-2"
              onClick={handleCopyCodes}>
              <VisuallyHidden>Copy codes</VisuallyHidden>
              <Clipboard />
            </ActionIcon>
          </Tooltip>
        </div>

        <Button
          variant="light"
          color="gray"
          radius="md"
          size="md"
          className="w-full"
          leftSection={<Check />}
          onClick={onClose}>
          I've copied the codes
        </Button>
      </div>
    </Modal>
  );
};
