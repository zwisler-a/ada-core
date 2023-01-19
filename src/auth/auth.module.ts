import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './controllers/auth.controller';
import { GoogleController } from './controllers/google.controller';
import { OAuth2Controller } from './controllers/oauth.controller';
import { UserEntity } from './persistance/entitiy/user.entity';
import { GoogleService } from './services/google.service';
import { GoogleStrategy } from './strategies/google.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity]),
        JwtModule.register({ secret: process.env.JWT_SECRET }),
        HttpModule
    ],
    controllers: [OAuth2Controller, AuthController, GoogleController],
    providers: [AuthService, LocalStrategy, JwtStrategy, GoogleStrategy, GoogleService],
})
export class AuthModule { }