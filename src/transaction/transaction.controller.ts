import { Controller, Get, HttpCode, HttpStatus, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { IdParameter, TransactionResponse } from '$/common/dto';
import { ApiGroup } from '$/common/enum/api-group.enum';
import { InternalServerError, UnauthorizedError } from '$/common/error';
import { JwtAuthGuard } from '$/common/guards/jwt-auth.guard';
import { TransactionService } from '$/transaction/transaction.service';

const TAG = ApiGroup.Transaction;

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get(':id')
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
    status: HttpStatus.UNAUTHORIZED,
    description: 'Access denied.',
    type: UnauthorizedError,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'An internal error occurred.',
    type: InternalServerError,
  })
  async getById(@Param() { id }: IdParameter): Promise<TransactionResponse> {
    const transaction = await this.transactionService.getById(id);
    return new TransactionResponse(transaction);
  }
}
