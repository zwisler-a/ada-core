import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccessTokenPayload } from './data-types/access-token';
import { UserEntity } from './persistance/entitiy/user.entity';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>
    ) { }

    async validateUser(username: string, pass: string): Promise<UserEntity> {
        const user = await this.userRepo.findOne({ where: { name: username, password: pass } })
        return user;
    }

    createAccessToken(user: UserEntity) {
        const payload: AccessTokenPayload = {
            userId: user.id
        }
        return this.jwtService.sign(payload, { expiresIn: '7d' })
    }

    getUser(token: AccessTokenPayload) {
        return this.userRepo.findOneBy({ id: token.userId });
    }
}