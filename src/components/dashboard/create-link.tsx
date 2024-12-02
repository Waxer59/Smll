'use client';

import { Button } from '@mantine/core';
import { Plus } from 'lucide-react';
import { NewLinkModal } from './new-link-modal';
import { useState } from 'react';
import { type CreateLinkDetails } from '@/types';
import { toast } from 'sonner';
import { useLinksStore } from '@/store/links';
import { createShortenedLink } from '@/lib/server/linkDocument';

export const CreateLink = () => {
  const addLink = useLinksStore((state) => state.addLink);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadingCreation, setIsLoadingCreation] = useState(false);

  const handleCreateNewLink = async (createLink: CreateLinkDetails) => {
    setIsLoadingCreation(true);
    setIsModalOpen(true);

    try {
      const { success, link: data } = await createShortenedLink(createLink);

      if (success) {
        toast.success('Link created successfully.');
        addLink(data!);
        setIsModalOpen(false);
      } else {
        toast.error('Failed to create link.');
      }
    } catch (error) {
      toast.error('Failed to create link.');
      console.log(error);
    } finally {
      setIsLoadingCreation(false);
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
        className="h-full w-full"
        onClick={handleOpenModal}>
        <div className="flex flex-col items-center justify-center gap-6">
          <Plus size={48} />
          <h3 className="text-xl">Create new link</h3>
        </div>
      </Button>
      {isModalOpen && (
        <NewLinkModal
          opened={isModalOpen}
          onSubmit={handleCreateNewLink}
          isLoadingCreation={isLoadingCreation}
          onClose={() => {
            setIsModalOpen(false);
          }}
        />
      )}
    </>
  );
};
