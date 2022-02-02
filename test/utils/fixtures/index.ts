import { Request, Response } from 'express';

import {
  CreateTransactionRequest,
  CreateWalletRequest,
  HealthCheckResponse,
  JwtResponse,
  LoginRequest,
  TransactionResponse,
  UserProfileResponse,
  UserRegistrationRequest,
  WalletResponse,
} from '$/common/dto';
import { TransactionState } from '$/common/enum/transaction-state.enum';
import { TransactionType } from '$/common/enum/transaction-type.enum';
import { DEFAULT_PASSWORD } from '$/db/fixtures/user.fixture';

const now = new Date();

// ----------------------------
// Database Entities
// ----------------------------
export const userMockJohn: Api.Entities.User = {
  uuid: '7a39a121-fdbf-45db-9353-a006bde4261a' as Uuid,
  email: 'john@example.com' as Email,
  password: DEFAULT_PASSWORD,
  createdAt: now,
  wallets: [],
};

export const walletMockMain: Api.Entities.Wallet = {
  uuid: 'a6891978-1cea-44a9-ba2c-e221741ac51b' as Uuid,
  balance: 10_000,
  name: 'Main',
  createdAt: now,
  user: userMockJohn,
  transactions: [],
};

// Assign the wallet to John
userMockJohn.wallets = [walletMockMain];

export const transactionMockPayedAlice: Api.Entities.Transaction = {
  uuid: '63d929fc-d720-436e-bf02-8bbcab43ba8a' as Uuid,
  amount: 50,
  reference: 'Payed Alice',
  state: TransactionState.Processed,
  type: TransactionType.Debit,
  createdAt: now,
  documents: [],
  wallet: walletMockMain,
};

export const transactionMockPaymentFromBob: Api.Entities.Transaction = {
  uuid: '6ca66bda-552a-4890-aae3-8610307fc548' as Uuid,
  amount: 150,
  reference: 'Payment From Bob',
  state: TransactionState.Processed,
  type: TransactionType.Credit,
  createdAt: now,
  documents: [],
  wallet: walletMockMain,
};

// Assign the transaction to the main wallet
walletMockMain.transactions = [transactionMockPayedAlice];

export const walletMockSecondary: Api.Entities.Wallet = {
  uuid: '91ef6965-3ce4-4b05-ad7c-cec4bcbdca66' as Uuid,
  balance: 10_000,
  name: 'Secondary',
  createdAt: now,
  user: userMockJohn,
  transactions: [],
};

// Assign the wallet to John
userMockJohn.wallets = [walletMockSecondary];

// ----------------------------
// DTO
// ----------------------------

// Auth
export const loginRequestMock = {
  email: userMockJohn.email,
  password: userMockJohn.password,
} as LoginRequest;

// Health
export const healthCheckResponseMock = new HealthCheckResponse({ status: 'OK' });

// JWT
export const jwtTokenMock =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiMzQzYzZhYzUtMmI3Mi00YzQxLWE5ZWItMjhmNWFlNDlhZjgwIiwiaWF0IjoxNjQzMTE5NTYyLCJleHAiOjE2NDMxMjA0NjIsImlzcyI6InN1cHBvcnRAZGVsbGluZ3IuY29tIiwianRpIjoiYjU2MjU3NjAtMTRhZC00OGNlLTgxNDUtZjFhNzE1ZWUyMzdlIn0.e0yEsIKmkupdNInE7vbEYHxEBQZ8VLDVKN4289nchyk' as JwtToken;

export const jwtPayloadMock = {
  uuid: userMockJohn.uuid,
} as Api.JwtPayload;

export const jwtResponseMock = new JwtResponse({ token: jwtTokenMock });

// Transaction
export const createTransactionRequestMockCredit = {
  amount: transactionMockPaymentFromBob.amount,
  reference: transactionMockPaymentFromBob.reference,
  type: transactionMockPaymentFromBob.type,
  walletId: transactionMockPaymentFromBob.wallet!.uuid,
} as CreateTransactionRequest;

export const createTransactionRequestMockDebit = {
  amount: transactionMockPayedAlice.amount,
  reference: transactionMockPayedAlice.reference,
  type: transactionMockPayedAlice.type,
  walletId: transactionMockPayedAlice.wallet!.uuid,
} as CreateTransactionRequest;

export const transactionResponseMock = new TransactionResponse(transactionMockPayedAlice);

// User
export const userProfileResponseMock = new UserProfileResponse(userMockJohn);

export const userRegistrationRequestMock = {
  email: userMockJohn.email,
  password: userMockJohn.password,
} as UserRegistrationRequest;

// Wallet
export const createWalletRequestMock = {
  name: walletMockSecondary.name,
} as CreateWalletRequest;

export const walletResponseMock = new WalletResponse(walletMockMain);

// ----------------------------
// Express
// ----------------------------

// Request
export const requestMock = {
  body: {},
  params: {},
  query: {},
} as Request;

export const authenticatedRequestMock = {
  ...requestMock,
  userUuid: userMockJohn.uuid,
} as Api.AuthenticatedRequest;

// Response
export const responseMock = {
  clearCookie: jest.fn(),
  cookie: jest.fn(),
  contentType: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  send: jest.fn((body) => body),
  status: jest.fn().mockReturnThis(),
} as unknown as Response;
