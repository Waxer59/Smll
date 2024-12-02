'use client';

import { useLinksStore } from '@/store/links';
import { QrModal } from './qr-modal';
import { NewLinkModal } from './new-link-modal';
import { editLinkById } from '@/lib/server/linkDocument';
import { toast } from 'sonner';
import { useState } from 'react';

const NEXT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL!;

export const LinkModals = () => {
  const [isUpdatingLink, setIsUpdatingLink] = useState(false);
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
            setIsUpdatingLink(true);
            toast.promise(editLinkById(targetEditLink.id, link), {
              loading: 'Saving link...',
              success: (data) => {
                setEditLinkId(null);
                if (!data.success) {
                  toast.error('Failed to save link.');
                  return;
                }

                setIsUpdatingLink(false);
                editLinkByIdStore(targetEditLink.id, {
                  ...targetEditLink,
                  ...link,
                  shortenedLink: NEXT_PUBLIC_BASE_URL + '/' + link.code,
                  originalLink: link.links[0].url,
                  isSmartLink: Boolean(link.links.length > 1),
                  isProtectedByPassword: Boolean(link.links[0].password)
                });
                return 'Link saved successfully.';
              },
              error: () => {
                setEditLinkId(null);
                setIsUpdatingLink(false);
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
