'use client';

import { Button } from '@mantine/core';
import { Plus } from 'lucide-react';
import { NewLinkModal } from './new-link-modal';
import { useState } from 'react';
import { type CreateLinkDetails } from '@/types';
import { toast } from 'sonner';
import { useAccountStore } from '@/store/account';

export const CreateLink = () => {
  const addLink = useAccountStore((state) => state.addLink);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadingCreation, setisLoadingCreation] = useState(false);

  const handleCreateNewLink = async (createLink: CreateLinkDetails) => {
    setisLoadingCreation(true);

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
        addLink(data);
        setIsModalOpen(false);
      } else {
        toast.error('Failed to create link.');
      }
    } catch (error) {
      toast.error('Failed to create link.');
      console.log(error);
    } finally {
      setisLoadingCreation(false);
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
        isLoadingCreation={isLoadingCreation}
        onClose={() => {
          setIsModalOpen(false);
        }}
      />
    </>
  );
};
