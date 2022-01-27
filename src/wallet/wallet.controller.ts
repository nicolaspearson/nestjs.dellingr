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

import { CreateWalletRequest, IdParameter, WalletResponse } from '$/common/dto';
import { ApiGroup } from '$/common/enum/api-group.enum';
import { InternalServerError, UnauthorizedError } from '$/common/error';
import { JwtAuthGuard } from '$/common/guards/jwt-auth.guard';
import { WalletService } from '$/wallet/wallet.service';

const TAG = ApiGroup.Wallet;

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Allows a user to create a new wallet.',
    description: 'Creates a new wallet for the authenticated user.',
  })
  @ApiTags(TAG)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Wallet successfully created.',
    type: WalletResponse,
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
  async create(@Req() req: Request, @Body() dto: CreateWalletRequest): Promise<WalletResponse> {
    // We can use a non-null assertion below because the userUuid must exist on the
    // request because it is verified and added to the request by the JwtAuthGuard.
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const wallet = await this.walletService.create(req.userUuid!, dto.name);
    return new WalletResponse(wallet);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Allows a user to retrieve a wallet by id.',
    description: "Returns the authenticated user's requested wallet using the provided id.",
  })
  @ApiTags(TAG)
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Wallet successfully retrieved.',
    type: WalletResponse,
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
  async getById(@Req() req: Request, @Param() { id }: IdParameter): Promise<WalletResponse> {
    // We can use a non-null assertion below because the userUuid must exist on the
    // request because it is verified and added to the request by the JwtAuthGuard.
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const wallet = await this.walletService.getById(req.userUuid!, id);
    return new WalletResponse(wallet);
  }
}
