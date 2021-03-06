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

import { CreateWalletRequest, IdParameter, WalletResponse } from '$/common/dto';
import { ApiGroup } from '$/common/enum/api-group.enum';
import {
  BadRequestError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
} from '$/common/error';
import { JwtAuthGuard } from '$/common/guards/jwt-auth.guard';
import { WalletService } from '$/wallet/wallet.service';

const TAG = ApiGroup.Wallet;

@Controller()
export class WalletController {
  private readonly logger: Logger = new Logger(WalletController.name);

  constructor(private readonly walletService: WalletService) {
    this.logger.debug('Wallet controller created!');
  }

  @Post('wallets')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Allows a user to create a new wallet.',
    description: 'Creates a new wallet for the authenticated user.',
  })
  @ApiTags(TAG)
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Wallet successfully created.',
    type: WalletResponse,
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
    description: 'The provided user does not exist.',
    type: NotFoundError,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'An internal error occurred.',
    type: InternalServerError,
  })
  async create(
    @Req() req: Api.AuthenticatedRequest,
    @Body() dto: CreateWalletRequest,
  ): Promise<WalletResponse> {
    const wallet = await this.walletService.create(req.userUuid, dto);
    return new WalletResponse(wallet);
  }

  @Get('wallet/:id')
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
    description: 'The requested wallet does not exist.',
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
  ): Promise<WalletResponse> {
    const wallet = await this.walletService.getById(req.userUuid, id);
    return new WalletResponse(wallet);
  }
}
