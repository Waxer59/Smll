'use client';

import { Button } from '@mantine/core';
import { Plus } from 'lucide-react';
import { NewLinkModal } from './new-link-modal';
import { useState } from 'react';

export const CreateLink = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <Button
        radius="md"
        color="dark"
        className="h-full w-52"
        onClick={handleOpenModal}>
        <div className="flex flex-col items-center justify-center gap-6">
          <Plus size={48} />
          <h3 className="text-xl">Create new link</h3>
        </div>
      </Button>
      <NewLinkModal
        opened={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
      />
    </>
  );
};
