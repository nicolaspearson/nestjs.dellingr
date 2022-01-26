import { Request, Response } from 'express';

import {
  HealthCheckResponse,
  JwtResponse,
  LoginRequest,
  UserProfileResponse,
  UserRegistrationRequest,
} from '$/common/dto';
import { TransactionState } from '$/common/enum/transaction-state.enum';
import { TransactionType } from '$/common/enum/transaction-type.enum';
import Transaction from '$/db/entities/transaction.entity';
import User from '$/db/entities/user.entity';
import Wallet from '$/db/entities/wallet.entity';
import { DEFAULT_PASSWORD } from '$/db/fixtures/user.fixture';

const now = new Date();

// Database entities
export const userMock: Omit<User, 'wallets'> = {
  uuid: '7a39a121-fdbf-45db-9353-a006bde4261a' as Uuid,
  email: 'test@example.com' as Email,
  password: DEFAULT_PASSWORD,
  createdAt: now,
  setDefaults: jest.fn(),
};

export const transactionMock: Omit<Transaction, 'wallet'> = {
  uuid: '63d929fc-d720-436e-bf02-8bbcab43ba8a' as Uuid,
  amount: 50,
  reference: 'Payed Alice',
  state: TransactionState.Processed,
  type: TransactionType.Debit,
  createdAt: now,
};

export const walletMock: Wallet = {
  uuid: '91ef6965-3ce4-4b05-ad7c-cec4bcbdca66' as Uuid,
  balance: 10_000,
  name: 'Main',
  createdAt: now,
  user: { ...userMock, wallets: [] } as User,
  transactions: [transactionMock as Transaction],
  setDefaults: jest.fn(),
};

export const userMockWithWallet: User = {
  ...userMock,
  uuid: '9d9cd0f5-cc63-40c8-bd03-574e1a519431' as Uuid,
  wallets: [walletMock],
};

export const transactionMockWithWallet: Transaction = {
  ...transactionMock,
  uuid: 'fa821750-a3c7-471e-a16a-b4a15dce8236' as Uuid,
  wallet: walletMock,
};

// ----------------------------

// Token
export const jwtTokenMock =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiMzQzYzZhYzUtMmI3Mi00YzQxLWE5ZWItMjhmNWFlNDlhZjgwIiwiaWF0IjoxNjQzMTE5NTYyLCJleHAiOjE2NDMxMjA0NjIsImlzcyI6InN1cHBvcnRAZGVsbGluZ3IuY29tIiwianRpIjoiYjU2MjU3NjAtMTRhZC00OGNlLTgxNDUtZjFhNzE1ZWUyMzdlIn0.e0yEsIKmkupdNInE7vbEYHxEBQZ8VLDVKN4289nchyk' as JwtToken;

export const jwtPayloadMock = {
  uuid: userMock.uuid,
} as Api.JwtPayload;

// Auth
export const loginRequestMock = {
  email: userMock.email,
  password: userMock.password,
} as LoginRequest;

export const jwtResponseMock = new JwtResponse({ token: jwtTokenMock });

// Health
export const healthCheckResponseMock = new HealthCheckResponse({ status: 'OK' });

// User
export const userProfileResponseMock = new UserProfileResponse({
  uuid: userMock.uuid,
  email: userMock.email,
  wallets: [walletMock],
});

export const userRegistrationRequestMock = {
  email: userMock.email,
  password: userMock.password,
} as UserRegistrationRequest;

// ----------------------------

// Express

export const requestMock = {
  body: {},
  params: {},
  query: {},
} as Request;

export const responseMock = {
  clearCookie: jest.fn(),
  cookie: jest.fn(),
  contentType: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  send: jest.fn((body) => body),
  status: jest.fn().mockReturnThis(),
} as unknown as Response;

export const authenticatedRequestMock = {
  ...requestMock,
  userUuid: userMock.uuid,
} as Request;
