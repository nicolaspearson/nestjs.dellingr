import { oneLineTrim } from 'common-tags';

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { UserProfileResponse, UserRegistrationRequest } from '$/common/dto';
import { ApiGroup } from '$/common/enum/api-group.enum';
import {
  BadRequestError,
  ConflictError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
} from '$/common/error';
import { JwtAuthGuard } from '$/common/guards/jwt-auth.guard';
import { DatabaseTransactionInterceptor } from '$/db/interceptors/database-transaction.interceptor';
import { UserService } from '$/user/user.service';

const TAG = ApiGroup.User;

@Controller()
export class UserController {
  private readonly logger: Logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {
    this.logger.debug('User controller created!');
  }

  @Delete('user')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Allows a user to delete their account.',
    description: 'Deletes the account of the authenticated user.',
  })
  @ApiTags(TAG)
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'User has been successfully deleted.',
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
  delete(@Req() req: Api.AuthenticatedRequest): Promise<void> {
    return this.userService.delete(req.userUuid);
  }

  @Get('user')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Allows a user to retrieve their profile.',
    description: "Returns the authenticated user's profile",
  })
  @ApiTags(TAG)
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User profile successfully retrieved.',
    type: UserProfileResponse,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Access denied.',
    type: UnauthorizedError,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The requested user does not exist.',
    type: NotFoundError,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'An internal error occurred.',
    type: InternalServerError,
  })
  async profile(@Req() req: Api.AuthenticatedRequest): Promise<UserProfileResponse> {
    const user = await this.userService.profile(req.userUuid);
    return new UserProfileResponse(user);
  }

  @Post('users/registration')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Allows a new user to register.',
    description: oneLineTrim`
      Registers a new user, if the user already exists a 201 will be returned to avoid
      user enumeration attacks, however we are still vulnerable to a timing attack which
      is out of scope for the moment.
    `,
  })
  @ApiTags(TAG)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User has successfully registered.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid payload provided.',
    type: BadRequestError,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'An internal error occurred.',
    type: InternalServerError,
  })
  // Uses an interceptor to wrap the HTTP request in a database transaction.
  @UseInterceptors(DatabaseTransactionInterceptor)
  async register(@Body() dto: UserRegistrationRequest): Promise<void> {
    try {
      await this.userService.register(dto.email, dto.password);
    } catch (error) {
      // Ignore conflict errors to avoid user enumeration attacks.
      /* istanbul ignore next: else path does not matter */
      if (!(error instanceof ConflictError)) {
        /* istanbul ignore next: covered in the unit tests */
        throw error;
      }
    }
  }
}
