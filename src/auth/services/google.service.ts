import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { firstValueFrom, map } from 'rxjs';
import { Repository } from 'typeorm';
import { UserEntity } from '../persistance/entitiy/user.entity';

@Injectable()
export class GoogleService {
  constructor(
    private http: HttpService,
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
  ) {}

  async registerOrAuthenticate(user: any) {
    let dbUser = await this.userRepo.findOne({
      where: { provider: 'google', externalId: user.sub },
    });
    if (!dbUser) {
      dbUser = await this.createGoogleUser(user);
    }
    return dbUser;
  }

  private async createGoogleUser(googleUser) {
    const entity = new UserEntity();
    entity.externalId = googleUser.id;
    entity.provider = 'google';
    entity.name = googleUser.displayName;
    return this.userRepo.save(entity);
  }
}
