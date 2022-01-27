import { oneLineTrim } from 'common-tags';
import { Request, Response } from 'express';

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { UserProfileResponse, UserRegistrationRequest } from '$/common/dto';
import { ApiGroup } from '$/common/enum/api-group.enum';
import { InternalServerError, UnauthorizedError } from '$/common/error';
import { JwtAuthGuard } from '$/common/guards/jwt-auth.guard';
import { UserService } from '$/user/user.service';

const TAG = ApiGroup.User;

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

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
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'An internal error occurred.',
    type: InternalServerError,
  })
  async profile(@Req() req: Request): Promise<UserProfileResponse> {
    // We can use a non-null assertion below because the userUuid must exist on the
    // request because it is verified and added to the request by the JwtAuthGuard.
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const user = await this.userService.profile(req.userUuid!);
    return new UserProfileResponse(user);
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
  delete(@Req() req: Request): Promise<void> {
    // We can use a non-null assertion below because the userUuid must exist on the
    // request because it is verified and added to the request by the JwtAuthGuard.
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.userService.delete(req.userUuid!);
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
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'An internal error occurred.',
    type: InternalServerError,
  })
  async register(@Res() res: Response, @Body() dto: UserRegistrationRequest): Promise<void> {
    try {
      await this.userService.register(dto.email, dto.password);
    } catch {
      // Ignore errors to avoid user enumeration attacks.
    }
    res.status(201).json({});
  }
}
