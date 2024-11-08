import { getLinkByPassword } from '@/helpers/getLinkByPassword';
import { SingleLinkDetails } from '@/types';
import { assert, describe, it } from 'vitest';

enum HASHED_PASSWORD {
  password = '$2a$12$kMYo6AxifpTJsEDULcXcIu1oMt7FkC5l0TII5PWlsNkPnqcqn8d4e',
  password2 = '$2a$12$VE/nFQxMHQ7Y7xw/1Ps1XuXrm1.jAcpNseHq.gPo4LHFaplzPdQim'
}

describe('Test getLinkByPassword', () => {
  it('should return null, password is incorrect', async () => {
    const links: SingleLinkDetails[] = [
      {
        url: 'https://www.google.com',
        password: HASHED_PASSWORD.password
      }
    ];

    const password = 'incorrect';

    const link = await getLinkByPassword(links, password);

    assert.equal(link, null);
  });
  it('should return link, password is correct', async () => {
    const links: SingleLinkDetails[] = [
      {
        url: 'https://www.google.com',
        password: HASHED_PASSWORD.password
      },
      {
        url: 'https://hgo.one',
        password: HASHED_PASSWORD.password2
      }
    ];

    const password = 'password';

    const link = await getLinkByPassword(links, password);

    assert.equal(link, 'https://www.google.com');
  });
});
