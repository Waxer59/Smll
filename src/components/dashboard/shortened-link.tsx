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
  ToggleLeft
} from 'lucide-react';

interface Props {
  link: LinkDetails;
}

export const ShortenedLink: React.FC<Props> = ({ link }) => {
  const {
    originalLink,
    shortenedLink,
    isProtectedByPassword,
    isProtectedBySmartPassword,
    createdAt,
    clicks,
    activeFrom,
    activeTo,
    maxClicks,
    tags,
    isEnabled
  } = link;

  return (
    <Card radius="md" className="flex flex-col h-full gap-6">
      <header className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          {isProtectedByPassword && (
            <Tooltip label="Link is protected by password">
              <Lock size={16} />
            </Tooltip>
          )}
          {isProtectedBySmartPassword && (
            <Tooltip label="Link is protected by smart password">
              <BrainCircuit size={16} />
            </Tooltip>
          )}
          <h3 className="text-2xl font-semibold">{originalLink}</h3>
          <div className="flex items-center gap-2">
            <ActionIcon color="subtle" variant="subtle">
              <VisuallyHidden>Shorten Link</VisuallyHidden>
              <ExternalLink size={16} />
            </ActionIcon>
            <ActionIcon color="subtle" variant="subtle">
              <VisuallyHidden>Link Settings</VisuallyHidden>
              <Settings size={16} />
            </ActionIcon>
          </div>
        </div>
        <h3 className="text-sm text-gray-400">{shortenedLink}</h3>
      </header>
      <ul className="flex gap-10 items-center">
        <li className="flex items-center gap-2">
          <Calendar size={16} />
          <span>Created: {createdAt.toLocaleDateString('en-US')}</span>
        </li>
        <li className="flex items-center gap-2">
          <MousePointerClick size={16} />
          <span>
            Clicks: {clicks} {maxClicks ? `/ ${maxClicks}` : ''}
          </span>
        </li>
      </ul>
      <ul className="flex flex-col gap-2">
        {activeFrom && (
          <li>
            <Tooltip label="Link will be active from this date and time">
              <Badge
                color="gray"
                variant="light"
                size="lg"
                className="capitalize">
                Begins: {activeFrom.toLocaleDateString('en-US')}
              </Badge>
            </Tooltip>
          </li>
        )}
        {activeTo && (
          <li>
            <Tooltip label="Link will expire from this date and time">
              <Badge
                color="gray"
                variant="light"
                size="lg"
                className="capitalize">
                Expires: {activeTo.toLocaleDateString('en-US')}
              </Badge>
            </Tooltip>
          </li>
        )}
      </ul>
      <ul className="flex gap-1">
        {tags?.map(({ id, name }: { id: string; name: string }) => (
          <li key={id}>
            <Badge>{name}</Badge>
          </li>
        ))}
      </ul>
      <footer>
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <ActionIcon variant="default" color="gray" size="lg">
              <Copy size={18} />
            </ActionIcon>
            <ActionIcon variant="default" color="gray" size="lg">
              <QrCode size={18} />
            </ActionIcon>
          </div>
          <Button
            radius="md"
            variant={isEnabled ? 'light' : 'subtle'}
            color="gray"
            className="text-base"
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
