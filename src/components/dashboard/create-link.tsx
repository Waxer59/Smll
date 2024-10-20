'use client';

import { Button } from '@mantine/core';
import { Plus } from 'lucide-react';
import { NewLinkModal } from './new-link-modal';
import { useState } from 'react';
import { type CreateLinkDetails } from '@/types';
import { toast } from 'sonner';

export const CreateLink = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreatingLink, setIsCreatingLink] = useState(false);

  const handleCreateNewLink = async (createLink: CreateLinkDetails) => {
    setIsCreatingLink(true);

    try {
      const response = await fetch('/api/link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ link: createLink })
      });
      const data = await response.json();

      if (response.ok) {
        toast.success('Link created successfully.');
        setIsModalOpen(false);
      } else {
        toast.error('Failed to create link.');
      }

      console.log(data);
    } catch (error) {
      toast.error('Failed to create link.');
      console.log(error);
    } finally {
      setIsCreatingLink(false);
    }
  };

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
        onSubmit={handleCreateNewLink}
        isCreatingLink={isCreatingLink}
        onClose={() => {
          setIsModalOpen(false);
        }}
      />
    </>
  );
};
