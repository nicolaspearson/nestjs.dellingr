import { oneLine } from 'common-tags';
import { Request } from 'express';

import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CreateTransactionRequest, IdParameter, TransactionResponse } from '$/common/dto';
import { ApiGroup } from '$/common/enum/api-group.enum';
import {
  BadRequestError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
} from '$/common/error';
import { JwtAuthGuard } from '$/common/guards/jwt-auth.guard';
import { TransactionService } from '$/transaction/transaction.service';

const TAG = ApiGroup.Transaction;

@Controller()
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('transactions')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Allows a user to create a new transaction.',
    description: 'Creates a new transaction for the authenticated user.',
  })
  @ApiTags(TAG)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Transaction successfully created.',
    type: TransactionResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: oneLine`
        An invalid request payload has been provided or the user
        has insufficient funds to complete the transaction.
      `,
    type: BadRequestError,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Access denied.',
    type: UnauthorizedError,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The provided wallet does not exist.',
    type: NotFoundError,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'An internal error occurred.',
    type: InternalServerError,
  })
  async create(
    @Req() req: Request,
    @Body() dto: CreateTransactionRequest,
  ): Promise<TransactionResponse> {
    // We can use a non-null assertion below because the userUuid must exist on the
    // request because it is verified and added to the request by the JwtAuthGuard.
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const transaction = await this.transactionService.create(req.userUuid!, dto);
    return new TransactionResponse(transaction);
  }

  @Get('transaction/:id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Allows a user to retrieve a transaction by id.',
    description: "Returns the authenticated user's requested transaction using the provided id.",
  })
  @ApiTags(TAG)
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Transaction successfully retrieved.',
    type: TransactionResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid payload provided.',
    type: BadRequestError,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Access denied.',
    type: UnauthorizedError,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The requested transaction does not exist.',
    type: NotFoundError,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'An internal error occurred.',
    type: InternalServerError,
  })
  async getById(@Req() req: Request, @Param() { id }: IdParameter): Promise<TransactionResponse> {
    // We can use a non-null assertion below because the userUuid must exist on the
    // request because it is verified and added to the request by the JwtAuthGuard.
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const transaction = await this.transactionService.getById(req.userUuid!, id);
    return new TransactionResponse(transaction);
  }
}
