import { Injectable } from '@nestjs/common';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import express from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as jwksRsa from 'jwks-rsa';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: express.Request) => {
          const data = request?.cookies['auth'];
          if (!data) {
            const authHeader = request.headers['authorization'];
            return authHeader?.replace('Bearer ', '');
          }
          return data;
        },
      ]),
      secretOrKeyProvider: jwksRsa.passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `http://localhost:8080/.well-known/jwks.json`,
      }),
      ignoreExpiration: false,
      issuer: 'http://localhost:8080/',
      audience: 'ada',
      algorithms: ['RS256'],
    });
  }

  async validate(payload: any) {
    return payload;
  }
}

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
