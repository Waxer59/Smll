import { SingleLinkDetails } from '@/types';

export const areAllLinksPasswordsUnique = (links: SingleLinkDetails[]) =>
  links.every((link, index) =>
    links.slice(0, index).every((l) => l.password !== link.password)
  );
