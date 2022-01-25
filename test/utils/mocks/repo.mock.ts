import { mocked } from 'jest-mock';

import { UserRepository } from '$/db/repositories/user.repository';

import { userMock } from '#/utils/fixtures';

export const userMockRepo = mocked<
  Pick<
    UserRepository,
    'create' | 'delete' | 'findByUuid' | 'findByUuidOrFail' | 'findByValidCredentials'
  >
>(
  {
    create: jest.fn().mockResolvedValue(userMock),
    delete: jest.fn().mockResolvedValue({ affected: 1 }),
    findByUuid: jest.fn().mockResolvedValue(userMock),
    findByUuidOrFail: jest.fn().mockResolvedValue(userMock),
    findByValidCredentials: jest.fn().mockResolvedValue(userMock),
  },
  true,
);
