'use client';

import {
  Modal,
  TextInput,
  PasswordInput,
  Tooltip,
  ActionIcon,
  NumberInput,
  TagsInput,
  Button
} from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { Minus, Plus, MousePointerClick } from 'lucide-react';
import { useState } from 'react';
import { CreateLinkDetails, SmartLinkDetails } from '../../types/index';
import { LONG_LINK_EXAMPLE } from '@/constants';
import { z } from 'zod';
import { toast } from 'sonner';
import { isDateBefore } from '@/helpers/isDateBefore';

const formSchema = z.object({
  links: z.array(
    z.object({
      url: z.string().url(),
      password: z.string().optional()
    })
  ),
  deleteAt: z.date().optional(),
  activeAt: z.date().optional(),
  maxVisits: z.number().optional(),
  tags: z.string().array().optional(),
  code: z.string().optional()
});

interface Props {
  opened: boolean;
  onClose: () => void;
  onSubmit: (link: CreateLinkDetails) => void;
  smartLinks?: SmartLinkDetails[];
  isCreatingLink?: boolean;
}

export const NewLinkModal: React.FC<Props> = ({
  opened,
  smartLinks: smartLinksProp,
  isCreatingLink,
  onClose,
  onSubmit
}) => {
  const [smartLinks, setSmartLinks] = useState<SmartLinkDetails[]>(
    smartLinksProp ?? []
  );
  const [tags, setTags] = useState<string[]>([]);
  const isSmartPassword = smartLinks.length > 0;

  const onChangeSmartLink = (
    id: string,
    editedFields: Partial<SmartLinkDetails>
  ) => {
    setSmartLinks(
      smartLinks.map((link) => {
        if (link.id === id) {
          return {
            ...link,
            ...editedFields
          };
        }

        return link;
      })
    );
  };

  const onCreateNewPasswordLink = () => {
    const newId = crypto.randomUUID();

    setSmartLinks([
      ...smartLinks,
      {
        id: newId,
        url: '',
        password: ''
      }
    ]);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);

    const mainLink = formData.get('mainLink');
    const mainPassword = formData.get('mainPassword');
    const maxClicks = Number(formData.get('maxClicks'));
    const code = formData.get('code');
    const deleteAtRaw = formData.get('expires');
    const activeAtRaw = formData.get('activeAt');

    let deleteAt: Date | undefined;
    let activeAt: Date | undefined;

    if (deleteAtRaw) {
      deleteAt = new Date(deleteAtRaw as string);
    }

    if (activeAtRaw) {
      activeAt = new Date(activeAtRaw as string);
    }

    const { success, data } = formSchema.safeParse({
      links: [
        {
          url: mainLink,
          password: mainPassword
        },
        ...smartLinks.map((link) => ({
          url: link.url,
          password: link.password
        }))
      ],
      maxVisits: maxClicks,
      activeAt,
      deleteAt,
      code,
      tags
    });

    if (!success) {
      toast.error('Please check all fields are correct.');
      return;
    }

    if (deleteAt && activeAt && isDateBefore(deleteAt, activeAt)) {
      toast.error('Expires date must be after active date.');
      return;
    }

    onSubmit(data);
  };

  const removePasswordLink = (id: string) => {
    setSmartLinks(smartLinks.filter((link) => link.id !== id));
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      size="lg"
      title="Create new link"
      radius="md">
      <form
        className="flex flex-col gap-8 text-lg w-full"
        onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 w-full">
          <ul className="flex flex-col gap-4 w-full">
            <li className="flex items-end gap-2 w-full">
              <TextInput
                type="url"
                label="Link"
                className="flex-1"
                placeholder={LONG_LINK_EXAMPLE}
                description="Link to be shortened"
                name="mainLink"
                size="md"
                radius="md"
                required
              />
              <PasswordInput
                required={isSmartPassword}
                label="Password"
                name="mainPassword"
                placeholder="Password"
                className="flex-1"
                description="Password to protect the link"
                size="md"
                radius="md"
              />
            </li>
            {smartLinks.map(({ id, url, password }) => (
              <li className="flex items-end gap-2 w-full" key={id}>
                <div className="flex items-end gap-2 w-full">
                  <TextInput
                    type="url"
                    value={url}
                    onChange={(e) =>
                      onChangeSmartLink(id, { url: e.target.value })
                    }
                    label="Link"
                    placeholder={LONG_LINK_EXAMPLE}
                    description="Link to be shortened"
                    className="flex-1"
                    size="md"
                    radius="md"
                    required
                  />
                  <PasswordInput
                    required
                    value={password}
                    onChange={(e) =>
                      onChangeSmartLink(id, { password: e.target.value })
                    }
                    label="Password"
                    placeholder="Password"
                    className="flex-1"
                    description="Password to protect the link"
                    size="md"
                    radius="md"
                  />
                </div>
                <Tooltip label="Remove link" color="gray">
                  <ActionIcon
                    onClick={() => removePasswordLink(id)}
                    size="xl"
                    color="gray"
                    radius="md"
                    variant="light">
                    <Minus size={22} />
                  </ActionIcon>
                </Tooltip>
              </li>
            ))}
          </ul>
          <Tooltip label="Create smart password link" color="gray">
            <ActionIcon
              onClick={onCreateNewPasswordLink}
              variant="default"
              color="gray"
              radius="md"
              size="lg"
              className="w-full">
              <Plus />
            </ActionIcon>
          </Tooltip>
        </div>
        <div className="flex items-end gap-2">
          <TextInput
            label="Code"
            placeholder="abc123"
            description="Custom code to be used instead of random code"
            className="flex-1"
            name="code"
            size="md"
            radius="md"
          />
          <NumberInput
            label="Max clicks"
            leftSection={<MousePointerClick size={16} />}
            description="Link will be disabled after this number of clicks"
            className="flex-1"
            name="maxClicks"
            min={0}
            size="md"
            radius="md"
          />
        </div>
        <div className="flex gap-2">
          <DateTimePicker
            label="Expires"
            clearable
            description="Link will expire from this date and time"
            className="flex-1"
            name="expires"
            size="md"
            radius="md"
          />
          <DateTimePicker
            label="Begins"
            clearable
            description="Link will be active from this date and time"
            className="flex-1"
            name="activeAt"
            size="md"
            radius="md"
          />
        </div>
        <TagsInput
          label="Tags"
          clearable
          description="Tags to categorize the link"
          placeholder='"Public", "Private"'
          value={tags}
          onChange={setTags}
          size="md"
          radius="md"
        />
        <Button
          type="submit"
          radius="md"
          color="dark"
          className="w-full"
          loading={isCreatingLink}
          disabled={isCreatingLink}>
          Create link
        </Button>
      </form>
    </Modal>
  );
};
