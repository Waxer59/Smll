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
import { DatePickerInput } from '@mantine/dates';
import { Minus, Plus, MousePointerClick, Undo } from 'lucide-react';
import { useState } from 'react';
import {
  CreateLinkDetails,
  LinkDetails,
  SingleLinkDetails,
  SmartLinkDetails
} from '@/types';
import { LONG_LINK_EXAMPLE } from '@/constants';
import { z } from 'zod';
import { toast } from 'sonner';
import { isDateBefore } from '@/helpers/isDateBefore';

const formSchema = z.object({
  links: z.array(
    z.object({
      url: z.string().url(),
      password: z.string().optional(),
      shouldUpdatePassword: z.boolean().optional()
    })
  ),
  deleteAt: z.date().optional(),
  activeAt: z.date().optional(),
  maxVisits: z.number().optional(),
  tags: z.string().array().optional(),
  code: z.string().optional()
});

interface Props {
  link?: LinkDetails;
  isEditing?: boolean;
  opened: boolean;
  onClose: () => void;
  onSubmit: (link: CreateLinkDetails) => void;
  isLoadingCreation?: boolean;
}

export const NewLinkModal: React.FC<Props> = ({
  opened,
  isLoadingCreation,
  onClose,
  onSubmit,
  isEditing,
  link
}) => {
  const [mainLink, setMainLink] = useState(link?.links[0].url ?? '');
  const [shouldUpdateMainLinkPassword, setShouldUpdateMainLinkPassword] =
    useState(false);
  const [mainPassword, setMainPassword] = useState('');
  const [smartLinks, setSmartLinks] = useState<SmartLinkDetails[]>(
    link?.links
      ?.slice(1)
      .map((el) => ({ ...el, id: crypto.randomUUID(), password: '' })) ?? []
  );
  const [tags, setTags] = useState<string[]>(link?.tags ?? []);
  const [expireDate, setExpireDate] = useState<Date | null>(
    link?.deleteAt ?? null
  );
  const [activeDate, setActiveDate] = useState<Date | null>(
    link?.activeAt ?? null
  );
  const [maxClicks, setMaxClicks] = useState<number | null>(
    link?.maxVisits ?? null
  );
  const [code, setCode] = useState<string>(link?.code ?? '');
  const isSmartPassword = smartLinks.length > 0;

  const onChangeSmartLink = (
    id: string,
    editedFields: Partial<SingleLinkDetails>
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
        password: '',
        isNew: true
      }
    ]);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let deleteAt: Date | undefined;
    let activeAt: Date | undefined;

    if (expireDate) {
      deleteAt = expireDate;
    }

    if (activeDate) {
      activeAt = activeDate;
    }

    const links = [
      {
        url: mainLink,
        password: mainPassword,
        // If the main link is protected by password and user didn't choose to remove it, we should update the password with the new one (even if it's empty, which means removing the password). Otherwise, we should keep the current password without updating it.
        shouldUpdatePassword: Boolean(link?.isProtectedByPassword)
          ? shouldUpdateMainLinkPassword
          : true
      },
      ...smartLinks.map((smartLink) => ({
        url: smartLink.url,
        password: smartLink.password,
        shouldUpdatePassword:
          // If the main link is protected by password and user didn't choose to remove it, we should update the password with the new one (even if it's empty, which means removing the password). Otherwise, we should keep the current password without updating it.
          Boolean(link?.isProtectedByPassword) && !smartLink.isNew
            ? smartLink.shouldUpdatePassword
            : true
      }))
    ];

    const arellLinksPasswordsUnique = links.every((link, index) =>
      links
        .slice(0, index)
        .every((l) => l.password !== link.password || l.password === '')
    );

    if (!arellLinksPasswordsUnique) {
      toast.error('All links passwords must be unique.');
      return;
    }

    const { success, data, error } = formSchema.safeParse({
      links: links,
      maxVisits: maxClicks === 0 || maxClicks === null ? undefined : maxClicks,
      activeAt,
      deleteAt,
      code,
      tags
    });

    if (!success) {
      toast.error('Please check all fields are correct.');
      console.log(error);
      return;
    }

    if (deleteAt && activeAt && isDateBefore(deleteAt, activeAt)) {
      toast.error('Expires date must be after active date.');
      return;
    }

    onSubmit(data);

    // Remove smart links passwords
    setSmartLinks(smartLinks.map((link) => ({ ...link, password: '' })));
  };

  const removePasswordLink = (id: string) => {
    setSmartLinks(smartLinks.filter((link) => link.id !== id));
  };

  return (
    <Modal
      opened={opened}
      onClose={() => {
        onClose();
      }}
      size="lg"
      title={isEditing ? 'Edit link' : 'Create new link'}
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
                value={mainLink}
                onChange={(e) => setMainLink(e.target.value)}
                size="md"
                radius="md"
                required
              />
              {isEditing &&
              link!.isProtectedByPassword &&
              !shouldUpdateMainLinkPassword ? (
                <Button
                  variant="default"
                  size="md"
                  color="gray"
                  onClick={() => setShouldUpdateMainLinkPassword(true)}>
                  Remove current password
                </Button>
              ) : (
                <>
                  <PasswordInput
                    required={isSmartPassword}
                    value={mainPassword}
                    onChange={(e) => setMainPassword(e.target.value)}
                    label="Password"
                    name="mainPassword"
                    placeholder="Password"
                    className="flex-1"
                    description="Password to protect the link"
                    size="md"
                    radius="md"
                  />
                  {isEditing &&
                    link!.isProtectedByPassword &&
                    shouldUpdateMainLinkPassword && (
                      <Button
                        variant="default"
                        size="md"
                        color="gray"
                        onClick={() => setShouldUpdateMainLinkPassword(false)}>
                        <Undo />
                      </Button>
                    )}
                </>
              )}
            </li>
            {smartLinks.map(
              ({ id, url, password, shouldUpdatePassword, isNew }) => (
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
                    {isEditing &&
                    !isNew &&
                    link!.isProtectedByPassword &&
                    !shouldUpdatePassword ? (
                      <Button
                        variant="default"
                        size="md"
                        color="gray"
                        onClick={() =>
                          onChangeSmartLink(id, { shouldUpdatePassword: true })
                        }>
                        Remove current password
                      </Button>
                    ) : (
                      <>
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
                        {isEditing &&
                          link!.isProtectedByPassword &&
                          shouldUpdateMainLinkPassword && (
                            <Button
                              variant="default"
                              size="md"
                              color="gray"
                              onClick={() =>
                                onChangeSmartLink(id, {
                                  shouldUpdatePassword: false
                                })
                              }>
                              <Undo />
                            </Button>
                          )}
                      </>
                    )}
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
              )
            )}
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
            value={code}
            onChange={(e) => setCode(e.target.value)}
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
            value={maxClicks === 0 || maxClicks === null ? '' : maxClicks}
            onChange={(value) => setMaxClicks(+value)}
            startValue={1}
            min={0}
            size="md"
            radius="md"
          />
        </div>
        <div className="flex gap-2">
          <DatePickerInput
            label="Expires"
            clearable
            description="Link will expire from this date and time"
            className="flex-1"
            name="expires"
            size="md"
            radius="md"
            value={expireDate}
            onChange={setExpireDate}
          />
          <DatePickerInput
            label="Begins"
            clearable
            description="Link will be active from this date and time"
            className="flex-1"
            name="activeAt"
            size="md"
            radius="md"
            value={activeDate}
            onChange={setActiveDate}
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
          loading={isLoadingCreation}
          disabled={isLoadingCreation}>
          {isEditing ? 'Save' : 'Create link'}
        </Button>
      </form>
    </Modal>
  );
};
