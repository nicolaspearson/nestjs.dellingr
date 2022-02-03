import { oneLine } from 'common-tags';

import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CreateTransactionRequest, IdParameter, TransactionResponse } from '$/common/dto';
import { ApiGroup } from '$/common/enum/api-group.enum';
import { TransactionState } from '$/common/enum/transaction-state.enum';
import {
  BadRequestError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
} from '$/common/error';
import { JwtAuthGuard } from '$/common/guards/jwt-auth.guard';
import { DatabaseTransactionService } from '$/db/services/database-transaction.service';
import { TransactionService } from '$/transaction/transaction.service';

const TAG = ApiGroup.Transaction;

@Controller()
export class TransactionController {
  private readonly logger: Logger = new Logger(TransactionController.name);

  constructor(
    private readonly transactionService: TransactionService,
    private readonly databaseTransactionService: DatabaseTransactionService,
  ) {
    this.logger.debug('Transaction controller created!');
  }

  @Post('transactions')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Allows a user to create a new transaction.',
    description: 'Creates a new transaction for the authenticated user.',
  })
  @ApiTags(TAG)
  @ApiBearerAuth()
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
    @Req() req: Api.AuthenticatedRequest,
    @Body() dto: CreateTransactionRequest,
  ): Promise<TransactionResponse> {
    const transaction = await this.databaseTransactionService.execute(
      /* istanbul ignore next: covered in the integration tests */ () =>
        this.transactionService.create(req.userUuid, dto),
    );
    // Ideally this business logic should not reside in the controller, however
    // due to the fact that the function call above is wrapped in a transaction
    // throwing from the function will cause the transaction to be rolled back.
    if (transaction.state === TransactionState.Rejected) {
      throw new BadRequestError('Insufficient funds');
    }
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
  async getById(
    @Req() req: Api.AuthenticatedRequest,
    @Param() { id }: IdParameter,
  ): Promise<TransactionResponse> {
    const transaction = await this.transactionService.getById(req.userUuid, id);
    return new TransactionResponse(transaction);
  }
}
