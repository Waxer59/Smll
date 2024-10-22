import { Modal } from '@mantine/core';
import QrCode from 'react-qr-code';

interface Props {
  title: string;
  value: string;
  isOpen: boolean;
  onClose: () => void;
}

// TODO: Change QR and give the option to download it
export const QrModal: React.FC<Props> = ({ title, isOpen, value, onClose }) => {
  return (
    <Modal opened={isOpen} onClose={onClose} radius="md" title={title}>
      <div className="flex justify-center">
        <QrCode className="w-64 h-64" value={value} />
      </div>
    </Modal>
  );
};
