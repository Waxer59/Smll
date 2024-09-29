'use client';

import { Button, Modal } from '@mantine/core';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const DeleteAccountModal: React.FC<Props> = ({ isOpen, onClose }) => {
  return (
    <Modal title="Delete Account" opened={isOpen} onClose={onClose}>
      <div className="flex flex-col gap-4">
        <h2 className="text-3xl font-bold">Are you sure?</h2>
        <p>This action cannot be undone.</p>
      </div>
      <div className="flex gap-2 mt-4">
        <Button
          variant="subtle"
          color="gray"
          radius="md"
          size="md"
          className="w-full"
          onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="light"
          color="red"
          radius="md"
          size="md"
          className="w-full">
          Delete account
        </Button>
      </div>
    </Modal>
  );
};