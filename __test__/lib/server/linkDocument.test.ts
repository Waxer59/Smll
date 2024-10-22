import { getLinkByPassword, isLinkCorrect } from '@/lib/server/linkDocument';
import { CreateLinkDetails, SingleLinkDetails } from '@/types';
import { assert, describe, it } from 'vitest';

enum HASHED_PASSWORD {
  password = '$2a$12$kMYo6AxifpTJsEDULcXcIu1oMt7FkC5l0TII5PWlsNkPnqcqn8d4e',
  password2 = '$2a$12$VE/nFQxMHQ7Y7xw/1Ps1XuXrm1.jAcpNseHq.gPo4LHFaplzPdQim'
}

describe('Test isLinkCorrect', () => {
  it('should return false, password must be at least 1 character', () => {
    const createLink: CreateLinkDetails = {
      links: [
        {
          url: 'https://www.google.com',
          password: ' '
        }
      ]
    };

    const { success, errors } = isLinkCorrect(createLink);

    assert.equal(success, false, errors.join(','));
  });
  it('should return false, expire date must be before begin date', () => {
    const createLink: CreateLinkDetails = {
      links: [
        {
          url: 'https://www.google.com'
        }
      ],
      activeAt: new Date(),
      deleteAt: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 2)
    };

    const { success, errors } = isLinkCorrect(createLink);

    assert.equal(success, false, errors.join(','));
  });
  it('should return false, maxVisits must be greater than 0', () => {
    const createLink: CreateLinkDetails = {
      links: [
        {
          url: 'https://www.google.com'
        }
      ],
      maxVisits: 0
    };

    const { success, errors } = isLinkCorrect(createLink);

    assert.equal(success, false, errors.join(','));
  });
  it('should return false, tags must be at least 1 character', () => {
    const createLink: CreateLinkDetails = {
      links: [
        {
          url: 'https://www.google.com'
        }
      ],
      tags: ['', '']
    };

    const { success, errors } = isLinkCorrect(createLink);

    assert.equal(success, false, errors.join(','));
  });
  it('should return false, active date must be in the future', () => {
    const createLink: CreateLinkDetails = {
      links: [
        {
          url: 'https://www.google.com'
        }
      ],
      activeAt: new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 2)
    };

    const { success, errors } = isLinkCorrect(createLink);

    assert.equal(success, false, errors.join(','));
  });
  it('should return false, expire date must be in the future', () => {
    const createLink: CreateLinkDetails = {
      links: [
        {
          url: 'https://www.google.com'
        }
      ],
      deleteAt: new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 2)
    };

    const { success, errors } = isLinkCorrect(createLink);

    assert.equal(success, false, errors.join(','));
  });
  it('should return false, if one link have password, then all links must have password', () => {
    const createLink: CreateLinkDetails = {
      links: [
        {
          url: 'https://www.google.com',
          password: 'password'
        },
        {
          url: 'https://www.google.com'
        }
      ]
    };

    const { success, errors } = isLinkCorrect(createLink);

    assert.equal(success, false, errors.join(','));
  });
  it('should return false, all links passwords must be unique', () => {
    const createLink: CreateLinkDetails = {
      links: [
        {
          url: 'https://www.google.com',
          password: 'password'
        },
        {
          url: 'https://www.google.com',
          password: 'password'
        }
      ]
    };

    const { success, errors } = isLinkCorrect(createLink);

    assert.equal(success, false, errors.join(','));
  });
  it('should return false, links must be valid urls', () => {
    const createLink: CreateLinkDetails = {
      links: [
        {
          url: 'https://www.google.com'
        },
        {
          url: 'https://www.google.com'
        }
      ]
    };

    const { success, errors } = isLinkCorrect(createLink);

    assert.equal(success, false, errors.join(','));
  });
  it('should return true, only url', () => {
    const createLink: CreateLinkDetails = {
      links: [
        {
          url: 'https://www.google.com'
        }
      ]
    };

    const { success, errors } = isLinkCorrect(createLink);

    assert.equal(success, true, errors.join(','));
  });
  it('should return true, only url and password', () => {
    const createLink: CreateLinkDetails = {
      links: [
        {
          url: 'https://www.google.com',
          password: 'password'
        }
      ]
    };

    const { success, errors } = isLinkCorrect(createLink);

    assert.equal(success, true, errors.join(','));
  });
  it('should return true, multiple links', () => {
    const createLink: CreateLinkDetails = {
      links: [
        {
          url: 'https://www.google.com',
          password: 'password'
        },
        {
          url: 'https://www.google.com',
          password: 'password2'
        }
      ]
    };

    const { success, errors } = isLinkCorrect(createLink);

    assert.equal(success, true, errors.join(','));
  });
  it('should return true, multiple links and password with expire date', () => {
    const createLink: CreateLinkDetails = {
      links: [
        {
          url: 'https://www.google.com',
          password: 'password'
        },
        {
          url: 'https://www.google.com',
          password: 'password2'
        }
      ],
      deleteAt: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 2)
    };

    const { success, errors } = isLinkCorrect(createLink);

    assert.equal(success, true, errors.join(','));
  });
  it('should return true, multiple links and password with expire date and begin date', () => {
    const createLink: CreateLinkDetails = {
      links: [
        {
          url: 'https://www.google.com',
          password: 'password'
        },
        {
          url: 'https://www.google.com',
          password: 'password2'
        }
      ],
      activeAt: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 1),
      deleteAt: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 2)
    };

    const { success, errors } = isLinkCorrect(createLink);

    assert.equal(success, true, errors.join(','));
  });
  it('should return true, multiple links and password with expire date and begin date and max clicks', () => {
    const createLink: CreateLinkDetails = {
      links: [
        {
          url: 'https://www.google.com',
          password: 'password'
        },
        {
          url: 'https://www.google.com',
          password: 'password2'
        }
      ],
      activeAt: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 1),
      deleteAt: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 2),
      maxVisits: 2
    };

    const { success, errors } = isLinkCorrect(createLink);

    assert.equal(success, true, errors.join(','));
  });
  it('should return true, all fields', () => {
    const createLink: CreateLinkDetails = {
      links: [
        {
          url: 'https://www.google.com',
          password: 'password'
        },
        {
          url: 'https://www.google.com',
          password: 'password2'
        }
      ],
      activeAt: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 1),
      deleteAt: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 2),
      maxVisits: 2,
      tags: ['tag1', 'tag2'],
      code: 'abc123'
    };

    const { success, errors } = isLinkCorrect(createLink);

    assert.equal(success, true, errors.join(','));
  });
});

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
