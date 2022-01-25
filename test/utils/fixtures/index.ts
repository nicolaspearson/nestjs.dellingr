import { Request, Response } from 'express';

import {
  HealthCheckResponse,
  JwtResponse,
  LoginRequest,
  UserProfileResponse,
  UserRegistrationRequest,
} from '$/common/dto';
import User from '$/db/entities/user.entity';
import { DEFAULT_PASSWORD } from '$/db/fixtures/user.fixture';

const now = new Date();

// Database entities
export const userMock: Omit<User, 'wallet'> = {
  uuid: '7a39a121-fdbf-45db-9353-a006bde4261a' as Uuid,
  email: 'test@example.com' as Email,
  password: DEFAULT_PASSWORD,
  createdAt: now,
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
