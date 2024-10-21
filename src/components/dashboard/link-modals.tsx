'use client';

import { useUiStore } from '@/store/ui';
import { QrModal } from './qr-modal';
import { useAccountStore } from '@/store/account';
import { NewLinkModal } from './new-link-modal';

export const LinkModals = () => {
  const links = useAccountStore((state) => state.links);
  const editLinkId = useUiStore((state) => state.editLinkId);
  const setEditLinkId = useUiStore((state) => state.setEditLinkId);
  const qrLinkId = useUiStore((state) => state.qrLinkId);
  const setQrLinkId = useUiStore((state) => state.setQrLinkId);

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
