/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Note: This file is auto generated and should NOT be edited manually.
 */
export declare namespace Dellingr {
  export interface BadRequestError {
    /**
     * The HTTP response code.
     * example:
     * 400
     */
    code: number;
    /**
     * An array of error details.
     * example:
     * []
     */
    errors: {
      [key: string]: any;
    }[];
    /**
     * The error message.
     * example:
     * The server could not understand the request due to invalid syntax / arguments.
     */
    message: string;
    /**
     * The name of the error.
     * example:
     * BadRequest
     */
    name: string;
  }
  export interface CreateTransactionRequest {
    /**
     * The transaction amount.
     * example:
     * 100
     */
    amount: number;
    /**
     * The transaction reference.
     * example:
     * Payed Alice
     */
    reference: string;
    /**
     * The type of transaction.
     * example:
     * credit
     */
    type: 'credit' | 'debit';
    /**
     * The unique id of the wallet.
     * example:
     * 343c6ac5-2b72-4c41-a9eb-28f5ae49af80
     */
    walletId: string;
  }
  export interface CreateWalletRequest {
    /**
     * The name of the wallet
     * example:
     * Secondary
     */
    name: string;
  }
  export interface HealthCheckResponse {
    /**
     * The health status of the API.
     * example:
     * OK
     */
    status: string;
  }
  export interface InternalServerError {
    /**
     * The HTTP response code.
     * example:
     * 500
     */
    code: number;
    /**
     * An array of error details.
     * example:
     * []
     */
    errors: any[][];
    /**
     * The error message.
     * example:
     * The server has encountered a situation it doesn't know how to handle.
     */
    message: string;
    /**
     * The name of the error.
     * example:
     * InternalServerError
     */
    name: string;
  }
  export interface JwtResponse {
    /**
     * The jwt token.
     * example:
     * eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiMzQzYzZhYzUtMmI3Mi00YzQxLWE5ZWItMjhmNWFlNDlhZjgwIiwiaWF0IjoxNjM4MDkxNjEzLCJleHAiOjE2MzgwOTI1MTMsImlzcyI6InN1cHBvcnRAZ3Jhbml0ZS5jb20iLCJqdGkiOiJiZDZiMzMzZS04NWZkLTQ3YzgtOWMxMy03NDhhNDZjYTE5MmIifQ.jlMl8fFBUdItwkTiQsna74OqwhC6itNxc8IUyU4Imxs
     */
    token: string;
  }
  export interface LoginRequest {
    /**
     * The user's email address.
     * example:
     * john.doe@example.com
     */
    email: string;
    /**
     * The user's password.
     * example:
     * myS3cretP@55w0rd!
     */
    password: string;
  }
  export interface NotFoundError {
    /**
     * The HTTP response code.
     * example:
     * 404
     */
    code: number;
    /**
     * An array of error details.
     * example:
     * []
     */
    errors: any[][];
    /**
     * The error message.
     * example:
     * The requested entity could not be found.
     */
    message: string;
    /**
     * The name of the error.
     * example:
     * NotFound
     */
    name: string;
  }
  export interface TransactionResponse {
    /**
     * The transaction's unique id.
     * example:
     * 343c6ac5-2b72-4c41-a9eb-28f5ae49af80
     */
    id: string;
    /**
     * The transaction amount.
     * example:
     * 100
     */
    amount: number;
    /**
     * The transaction reference.
     * example:
     * Payed Alice
     */
    reference: string;
    /**
     * The state of the transaction.
     * example:
     * processed
     */
    state: 'pending' | 'processed' | 'rejected';
    /**
     * The type of transaction.
     * example:
     * credit
     */
    type: 'credit' | 'debit';
    /**
     * The date the transaction was created.
     * example:
     * 2022-01-26T10:49:53.129Z
     */
    createdAt: string;
    /**
     * The date the transaction was updated.
     * example:
     * 2022-01-26T10:49:53.129Z
     */
    updatedAt?: string | null;
  }
  export interface UnauthorizedError {
    /**
     * The HTTP response code.
     * example:
     * 401
     */
    code: number;
    /**
     * An array of error details.
     * example:
     * []
     */
    errors: any[][];
    /**
     * The error message.
     * example:
     * You are not authorized to access this endpoint.
     */
    message: string;
    /**
     * The name of the error.
     * example:
     * Unauthorized
     */
    name: string;
  }
  export interface UploadDocumentRequest {
    /**
     * The name of the document
     * example:
     * Payment invoice
     */
    name: string;
    /**
     * The unique id of the transaction.
     * example:
     * 343c6ac5-2b72-4c41-a9eb-28f5ae49af80
     */
    transactionId: string;
  }
  export interface UserProfileResponse {
    /**
     * The user's unique id.
     * example:
     * 343c6ac5-2b72-4c41-a9eb-28f5ae49af80
     */
    id: string;
    /**
     * The user's email address.
     * example:
     * john.doe@example.com
     */
    email: string;
    /**
     * The list of wallets that belong to the user.
     */
    wallets: WalletResponse[];
  }
  export interface UserRegistrationRequest {
    /**
     * The user's email address.
     * example:
     * john.doe@example.com
     */
    email: string;
    /**
     * The user's password.
     * example:
     * myS3cretP@55w0rd!
     */
    password: string;
  }
  export interface WalletResponse {
    /**
     * The wallet's unique id.
     * example:
     * 343c6ac5-2b72-4c41-a9eb-28f5ae49af80
     */
    id: string;
    /**
     * The wallet balance.
     * example:
     * 1000
     */
    balance: number;
    /**
     * The name of the wallet.
     * example:
     * Main
     */
    name: string;
    /**
     * The list of transactions that have occurred on this wallet.
     */
    transactions: TransactionResponse[];
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */
