import { LinkDetails } from '@/types';
import { MultiSelect, Button } from '@mantine/core';
import { Plus } from 'lucide-react';
import { ShortenedLink } from './shortened-link';

interface Props {
  tags?: string[];
  links?: LinkDetails[];
}

export const ShortenedLinks: React.FC<Props> = ({ tags, links }) => {
  return (
    <div className="flex flex-col items-start gap-10 mt-16">
      <div className="flex items-center justify-between w-full">
        <h2 className="text-3xl font-semibold">Your Links</h2>
        <MultiSelect
          clearable
          radius="md"
          label="Filter by tag"
          className="w-52"
          data={tags}
        />
      </div>
      <ul className="flex gap-10 h-64">
        <li>
          <Button radius="md" color="dark" className="h-full w-52">
            <div className="flex flex-col items-center justify-center gap-6">
              <Plus size={48} />
              <h3 className="text-xl">Create new link</h3>
            </div>
          </Button>
        </li>
        <li>
          {links?.map((link) => (
            <li key={link.id}>
              <ShortenedLink link={link} />
            </li>
          ))}
        </li>
      </ul>
    </div>
  );
};
