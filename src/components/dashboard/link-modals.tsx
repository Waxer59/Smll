'use client';

import { useLinksStore } from '@/store/links';
import { QrModal } from './qr-modal';
import { NewLinkModal } from './new-link-modal';
import { editLinkById } from '@/lib/server/linkDocument';
import { toast } from 'sonner';
import { useState } from 'react';

export const LinkModals = () => {
  const [isUpdatingLink, setisUpdatingLink] = useState(false);
  const links = useLinksStore((state) => state.links);
  const editLinkId = useLinksStore((state) => state.editLinkId);
  const setEditLinkId = useLinksStore((state) => state.setEditLinkId);
  const qrLinkId = useLinksStore((state) => state.qrLinkId);
  const setQrLinkId = useLinksStore((state) => state.setQrLinkId);
  const editLinkByIdStore = useLinksStore((state) => state.editLinkById);

  const targetQrLink = links.find((link) => link.id === qrLinkId);
  const targetEditLink = links.find((link) => link.id === editLinkId);

  return (
    <>
      {targetQrLink && (
        <QrModal
          isOpen
          value={targetQrLink?.shortenedLink ?? ''}
          title={targetQrLink?.links[0].url ?? ''}
          onClose={() => setQrLinkId(null)}
        />
      )}
      {targetEditLink && (
        <NewLinkModal
          opened
          onClose={() => setEditLinkId(null)}
          isLoadingCreation={isUpdatingLink}
          onSubmit={(link) => {
            setisUpdatingLink(true);
            toast.promise(editLinkById(targetEditLink.id, link), {
              loading: 'Saving link...',
              success: () => {
                setEditLinkId(null);
                setisUpdatingLink(false);
                editLinkByIdStore(targetEditLink.id, link);
                return 'Link saved successfully.';
              },
              error: () => {
                setEditLinkId(null);
                setisUpdatingLink(false);
                return 'Error saving link.';
              }
            });
          }}
          link={targetEditLink}
          isEditing
        />
      )}
    </>
  );
};
