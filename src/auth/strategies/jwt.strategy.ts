import { Injectable } from '@nestjs/common';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import express from "express";
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([(request: express.Request) => {
                let data = request?.cookies["auth"];
                if (!data) {
                    const authHeader = request.headers['authorization']
                    return authHeader?.replace('Bearer ', '');
                }
                return data
            }]),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET,
        });
    }

    async validate(payload: any) {
        return payload;
    }
}


@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') { }
