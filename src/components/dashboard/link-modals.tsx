'use client';

import { useLinksStore } from '@/store/links';
import { QrModal } from './qr-modal';
import { useAccountStore } from '@/store/account';
import { NewLinkModal } from './new-link-modal';

export const LinkModals = () => {
  const links = useAccountStore((state) => state.links);
  const editLinkId = useLinksStore((state) => state.editLinkId);
  const setEditLinkId = useLinksStore((state) => state.setEditLinkId);
  const qrLinkId = useLinksStore((state) => state.qrLinkId);
  const setQrLinkId = useLinksStore((state) => state.setQrLinkId);

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
          onSubmit={() => {}}
          link={targetEditLink}
          isEditing
        />
      )}
    </>
  );
};
