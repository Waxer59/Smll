'use client';

import { LinkDetails } from '@/types';
import {
  Card,
  Tooltip,
  ActionIcon,
  VisuallyHidden,
  Badge,
  Button
} from '@mantine/core';
import {
  BrainCircuit,
  ExternalLink,
  Settings,
  Calendar,
  MousePointerClick,
  Copy,
  QrCode,
  ToggleRight,
  Lock,
  ToggleLeft,
  Trash
} from 'lucide-react';
import { toast } from 'sonner';
import { useLinksStore } from '@/store/links';
import { deleteLinkById, editLinkById } from '@/lib/server/linkDocument';
import { useState } from 'react';

interface Props {
  link: LinkDetails;
}

export const ShortenedLink: React.FC<Props> = ({ link }) => {
  const {
    id,
    originalLink,
    shortenedLink,
    createdAt,
    deleteAt,
    activeAt,
    maxVisits,
    tags,
    isEnabled,
    isProtectedByPassword,
    isSmartLink,
    metrics
  } = link;

  const [isUpdatingLink, setIsUpdatingLink] = useState(false);
  const removeLinkById = useLinksStore((state) => state.removeLinkById);
  const setQrLinkId = useLinksStore((state) => state.setQrLinkId);
  const setEditLinkId = useLinksStore((state) => state.setEditLinkId);
  const editLinkByIdStore = useLinksStore((state) => state.editLinkById);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shortenedLink);
    toast.success('Link copied to clipboard.');
  };

  const handleEnableLink = () => {
    const newLink = {
      ...link,
      isEnabled: !isEnabled
    };

    setIsUpdatingLink(true);
    toast.promise(editLinkById(id, newLink), {
      loading: `${isEnabled ? 'Disabling' : 'Enabling'} link...`,
      success: (data) => {
        setIsUpdatingLink(false);
        console.log(data);
        if (!data.success) {
          toast.error('Failed to save link.');
          return;
        }

        editLinkByIdStore(id, newLink);
        return `Link ${isEnabled ? 'disabled' : 'enabled'} successfully.`;
      },
      error: () => {
        setIsUpdatingLink(false);
        editLinkByIdStore(id, newLink);
        return `Error ${isEnabled ? 'disabling' : 'enabling'} link.`;
      }
    });
  };

  const handleDeleteLink = async () => {
    setIsUpdatingLink(true);
    toast.promise(deleteLinkById(id), {
      loading: 'Deleting link...',
      success: (data) => {
        if (!data.success) {
          toast.error('Failed to delete link.');
          return;
        }

        removeLinkById(id);
        return 'Link deleted successfully.';
      },
      error: 'Failed to delete link.'
    });
  };

  return (
    <Card
      radius="md"
      padding="sm"
      className="flex flex-col justify-center h-full gap-6 overflow-auto link-card w-full">
      <header className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          {isProtectedByPassword && !isSmartLink && (
            <Tooltip label="Link is protected by password" color="gray">
              <Lock size={16} />
            </Tooltip>
          )}
          {isSmartLink && (
            <Tooltip label="Link is protected by smart password" color="gray">
              <BrainCircuit size={16} />
            </Tooltip>
          )}
          <div className="flex items-center justify-between gap-3 w-full">
            <h3 className="text-2xl font-semibold max-w-[20ch] truncate">
              {originalLink}
            </h3>
            <div className="flex items-center gap-2">
              <Tooltip label="Open shortened link" color="gray">
                <a
                  href={shortenedLink}
                  target="_blank"
                  rel="noreferrer noopener">
                  <ActionIcon color="subtle" variant="subtle">
                    <VisuallyHidden>Shorten Link</VisuallyHidden>
                    <ExternalLink size={16} />
                  </ActionIcon>
                </a>
              </Tooltip>
              <Tooltip label="Edit link" color="gray">
                <ActionIcon
                  color="subtle"
                  variant="subtle"
                  disabled={isUpdatingLink}
                  onClick={() => setEditLinkId(link.id)}>
                  <VisuallyHidden>Edit Link</VisuallyHidden>
                  <Settings size={16} />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Delete link" color="gray">
                <ActionIcon
                  color="subtle"
                  variant="subtle"
                  disabled={isUpdatingLink}
                  onClick={handleDeleteLink}>
                  <VisuallyHidden>Delete Link</VisuallyHidden>
                  <Trash size={16} />
                </ActionIcon>
              </Tooltip>
            </div>
          </div>
        </div>
        <h3 className="text-sm text-gray-400">{shortenedLink}</h3>
      </header>
      <ul className="flex gap-10 items-center justify-between">
        <li className="flex items-center gap-2">
          <Calendar size={16} />
          <span>
            Created: {new Date(createdAt).toLocaleDateString('en-US')}
          </span>
        </li>
        <li className="flex items-center gap-2">
          <MousePointerClick size={16} />
          <span>
            Clicks: {metrics?.reduce((acc, curr) => acc + curr.views, 0) ?? 0}{' '}
            {maxVisits ? `/ ${maxVisits}` : ''}
          </span>
        </li>
      </ul>
      <ul className="flex flex-col gap-2">
        {activeAt && (
          <li>
            <Tooltip
              label="Link will be active from this date and time"
              color="gray">
              <Badge
                color="gray"
                variant="light"
                size="lg"
                className="capitalize">
                Begins: {new Date(activeAt).toLocaleDateString('en-US')}
              </Badge>
            </Tooltip>
          </li>
        )}
        {deleteAt && (
          <li>
            <Tooltip
              label="Link will expire from this date and time"
              color="gray">
              <Badge
                color="gray"
                variant="light"
                size="lg"
                className="capitalize">
                Expires: {new Date(deleteAt).toLocaleDateString('en-US')}
              </Badge>
            </Tooltip>
          </li>
        )}
      </ul>
      <ul className="flex flex-wrap gap-1">
        {tags?.map((tag) => (
          <li key={tag}>
            <Badge color="gray">{tag}</Badge>
          </li>
        ))}
      </ul>
      <footer>
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <ActionIcon
              variant="default"
              color="gray"
              size="lg"
              onClick={handleCopyLink}>
              <Copy size={18} />
            </ActionIcon>
            <ActionIcon
              variant="default"
              color="gray"
              size="lg"
              onClick={() => setQrLinkId(link.id)}>
              <QrCode size={18} />
            </ActionIcon>
          </div>
          <Button
            radius="md"
            variant={isEnabled ? 'light' : 'subtle'}
            color="gray"
            className="text-base"
            disabled={isUpdatingLink}
            onClick={handleEnableLink}
            leftSection={
              isEnabled ? <ToggleRight size={16} /> : <ToggleLeft size={16} />
            }>
            {isEnabled ? 'Enabled' : 'Disabled'}
          </Button>
        </div>
      </footer>
    </Card>
  );
};
