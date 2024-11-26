'use client';

import { ActionIcon, Modal, Tooltip, VisuallyHidden } from '@mantine/core';
import { Download } from 'lucide-react';
import { useRef } from 'react';
import { QRCode } from 'react-qrcode-logo';

interface Props {
  title: string;
  value: string;
  isOpen: boolean;
  onClose: () => void;
}

export const QrModal: React.FC<Props> = ({ title, isOpen, value, onClose }) => {
  const qrRef = useRef<QRCode>(null);

  const handleDownload = () => {
    if (!qrRef.current) return;

    const qrElement = qrRef.current;

    qrElement.download('png', `${title}-qr.png`);
  };

  return (
    <Modal opened={isOpen} onClose={onClose} radius="md" title={title}>
      <div className="flex flex-col justify-center items-center gap-4">
        <QRCode
          ref={qrRef}
          logoWidth={256}
          logoHeight={256}
          eyeRadius={2}
          value={value}
          style={{ borderRadius: 12 }}
        />
        <Tooltip label="Download QR Code" color="gray">
          <ActionIcon
            className="w-full"
            onClick={handleDownload}
            size="xl"
            color="gray"
            radius="md"
            variant="light">
            <Download size={22} />
            <VisuallyHidden>Download QR Code</VisuallyHidden>
          </ActionIcon>
        </Tooltip>
      </div>
    </Modal>
  );
};
