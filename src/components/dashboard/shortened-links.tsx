import { MultiSelect } from '@mantine/core';
import { ShortenedLink } from './shortened-link';
import { LinkDetails } from '@/types';
import { CreateLink } from './create-link';
import { useState } from 'react';

interface Props {
  links?: LinkDetails[];
}

export const ShortenedLinks: React.FC<Props> = ({ links }) => {
  const linksTags = links?.map((link) => link.tags).flat();
  const [filterTags, setFilterTags] = useState<string[]>([]);

  const filteredLinks = links?.filter((link) => {
    if (filterTags.length === 0) {
      return true;
    }

    return filterTags.some((tag) => link.tags.includes(tag));
  });

  return (
    <div className="flex flex-col items-start gap-10 mt-16">
      <div className="flex items-center justify-between w-full">
        <h2 className="text-3xl font-semibold">Your Links</h2>
        <MultiSelect
          clearable
          radius="md"
          label="Filter by tag"
          className="w-52"
          data={linksTags}
          onChange={setFilterTags}
        />
      </div>
      <ul className="flex flex-wrap gap-10 w-full">
        <li className="h-72 flex-1 md:max-w-[300px]">
          <CreateLink />
        </li>
        {filteredLinks?.map((link) => (
          <li key={link.id} className="h-72 w-full md:flex-1 md:max-w-lg">
            <ShortenedLink link={link} />
          </li>
        ))}
      </ul>
    </div>
  );
};
