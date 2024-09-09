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

interface Props {
  opened: boolean;
  onClose: () => void;
}

export const NewLinkModal: React.FC<Props> = ({ opened, onClose }) => {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      size="lg"
      title="Create new link"
      radius="md">
      <form className="flex flex-col gap-8 text-lg w-full">
        <ul className="flex flex-col gap-4 w-full">
          <li className="flex items-end gap-2 w-full">
            <TextInput
              type="url"
              label="Link"
              className="flex-1"
              placeholder="https://verylonglink.com/abc123?is=verylong&really=long&iSaid=itwasReallyLong"
              description="Link to be shortened"
              size="md"
              radius="md"
              required
            />
            <PasswordInput
              label="Password"
              placeholder="Password"
              className="flex-1"
              description="Password to protect the link"
              size="md"
              radius="md"
            />
          </li>
          <li className="flex items-end gap-2 w-full">
            <div className="flex items-end gap-2 w-full">
              <TextInput
                type="url"
                label="Link"
                placeholder="https://verylonglink.com/abc123?is=verylong&really=long&iSaid=itwasReallyLong"
                description="Link to be shortened"
                className="flex-1"
                size="md"
                radius="md"
                required
              />
              <PasswordInput
                label="Password"
                placeholder="Password"
                className="flex-1"
                description="Password to protect the link"
                size="md"
                radius="md"
              />
            </div>
            <Tooltip label="Remove link">
              <ActionIcon size="xl" color="gray" radius="md" variant="light">
                <Minus size={22} />
              </ActionIcon>
            </Tooltip>
          </li>
          <li>
            <Tooltip label="Create smart password link">
              <ActionIcon
                variant="default"
                color="gray"
                radius="md"
                size="lg"
                className="w-full">
                <Plus />
              </ActionIcon>
            </Tooltip>
          </li>
        </ul>
        <div className="flex items-end gap-2">
          <TextInput
            label="Code"
            placeholder="abc123"
            description="Custom code to be used instead of random code"
            className="flex-1"
            size="md"
            radius="md"
            required
            withAsterisk={false}
          />
          <NumberInput
            label="Max clicks"
            leftSection={<MousePointerClick size={16} />}
            description="Link will be disabled after this number of clicks"
            className="flex-1"
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
            size="md"
            radius="md"
          />
          <DateTimePicker
            label="Begins"
            clearable
            description="Link will be active from this date and time"
            className="flex-1"
            size="md"
            radius="md"
          />
        </div>
        <TagsInput
          label="Tags"
          clearable
          description="Tags to categorize the link"
          placeholder='"Public", "Private"'
          size="md"
          radius="md"
        />
        <Button type="submit" radius="md" color="dark" className="w-full">
          Create link
        </Button>
      </form>
    </Modal>
  );
};
