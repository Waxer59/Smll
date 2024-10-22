import { MultiSelect } from '@mantine/core';
import { ShortenedLink } from './shortened-link';
import { LinkDetails } from '@/types';
import { CreateLink } from './create-link';

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
      <ul className="flex gap-10 h-72">
        <li>
          <CreateLink />
        </li>
        {links?.map((link) => (
          <li key={link.id}>
            <ShortenedLink link={link} />
          </li>
        ))}
      </ul>
    </div>
  );
};
