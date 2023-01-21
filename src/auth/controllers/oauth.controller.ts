import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  Res,
  UnauthorizedException,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiTags } from '@nestjs/swagger';
import express from 'express';
import { AccessTokenPayload } from '../data-types/access-token';
import { AuthorizationCodePayload } from '../data-types/authorization-code';
import { RefreshTokenPayload } from '../data-types/refresh-token';
import { JwtAuthGuard } from '../strategies/jwt.strategy';
import { UnauthorizedFilter } from '../unauthorized.filter';

@ApiTags('Authentication')
@Controller('/oauth')
export class OAuth2Controller {
  constructor(private jwt: JwtService) {}

  @Get('auth')
  @UseFilters(UnauthorizedFilter)
  @UseGuards(JwtAuthGuard)
  authorize(
    @Query('client_id') client_id,
    @Query('redirect_uri') redirect_uri,
    @Query('state') state,
    @Query('scope') scope,
    @Query('response_type') response_type,
    @Query('user_locale') user_locale,
    @Res() res: express.Response,
  ): void {
    if (!redirect_uri) throw new BadRequestException();
    // TODO validate redirect and client_id
    //
    const authorizationCodePayload: AuthorizationCodePayload = {
      userId: '123',
      redirect_uri,
    };
    const code = this.jwt.sign(authorizationCodePayload, { expiresIn: 600 });
    res.redirect(redirect_uri + `?code=${code}&state=${state}`);
  }

  @Post('token')
  tokenExchange(
    @Body('client_id') client_id,
    @Body('client_secret') client_secret,
    @Body('grant_type') grant_type,
    @Body('code') code,
    @Body('redirect_uri') redirect_uri,
    @Body('refresh_token') refresh_token,
  ): any {
    // TODO check clientid and client secret
    // id = google
    // secret = NxZQY76hHQ2Yav4d
    if (grant_type == 'authorization_code') {
      const authorizationCode: AuthorizationCodePayload = this.jwt.verify(code);
      if (authorizationCode.redirect_uri != redirect_uri)
        throw new UnauthorizedException('invalid redirect');
      const accessTokenPayload: AccessTokenPayload = {
        userId: authorizationCode.userId,
      };
      const refreshTokenPayload: RefreshTokenPayload = {
        userId: authorizationCode.userId,
      };
      return {
        token_type: 'Bearer',
        access_token: this.jwt.sign(accessTokenPayload, { expiresIn: 60 * 60 }),
        refresh_token: this.jwt.sign(refreshTokenPayload),
        expires_in: 60 * 60,
      };
    }

    if (grant_type == 'refresh_token') {
      const refreshTokenPayload: RefreshTokenPayload =
        this.jwt.verify(refresh_token);
      const accessTokenPayload: AccessTokenPayload = {
        userId: refreshTokenPayload.userId,
      };

      return {
        token_type: 'Bearer',
        access_token: this.jwt.sign(accessTokenPayload, { expiresIn: 60 * 60 }),
        expires_in: 60 * 60,
      };
    }
  }
}
