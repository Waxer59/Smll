'use client';

import { closeAllSessions, logoutUser } from '@/lib/server/appwrite';
import { Button, Modal } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const CloseAllSessionsModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleCloseAllSessions = async () => {
    setIsLoading(true);
    await closeAllSessions();
    logoutUser();
    router.push('/');
  };

  return (
    <Modal
      title="Delete Account"
      opened={isOpen || isLoading}
      onClose={onClose}>
      <div className="flex flex-col gap-4">
        <h2 className="text-3xl font-bold">Are you sure?</h2>
        <p>This will close all your sessions including the current one.</p>
      </div>
      <div className="flex gap-2 mt-4">
        <Button
          variant="subtle"
          color="gray"
          radius="md"
          size="md"
          className="w-full"
          onClick={onClose}
          disabled={isLoading}>
          Cancel
        </Button>
        <Button
          variant="light"
          color="red"
          radius="md"
          size="md"
          className="w-full"
          onClick={handleCloseAllSessions}
          loading={isLoading}>
          Close all sessions
        </Button>
      </div>
    </Modal>
  );
};
