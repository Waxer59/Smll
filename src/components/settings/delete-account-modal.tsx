'use client';

import {
  deleteAccount,
  logoutUser
} from '@/lib/server/appwrite-functions/auth';
import { Button, Modal } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const DeleteAccountModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleDeleteAccount = async () => {
    setIsLoading(true);
    await deleteAccount();
    logoutUser();
    router.push('/');
  };

  return (
    <Modal
      radius="md"
      title="Delete Account"
      opened={isOpen || isLoading}
      onClose={onClose}>
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
          onClick={handleDeleteAccount}
          loading={isLoading}>
          Delete account
        </Button>
      </div>
    </Modal>
  );
};
