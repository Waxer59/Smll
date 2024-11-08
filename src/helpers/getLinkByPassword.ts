import { SingleLinkDetails } from '@/types';
import { compareSync } from 'bcrypt';

export async function getLinkByPassword(
  links: SingleLinkDetails[],
  password: string
): Promise<string | null> {
  const link = links.find(
    (link) => link.password && compareSync(password, link.password)
  );

  if (!link) {
    return null;
  }

  return link.url;
}
