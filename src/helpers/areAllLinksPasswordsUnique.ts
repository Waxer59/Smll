import { SingleLinkDetails } from '@/types';

export const areAllLinksPasswordsUnique = (links: SingleLinkDetails[]) => {
  return links.every(
    (link) => !links.some((l) => l.password === link.password)
  );
};
