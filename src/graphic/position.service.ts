import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PositionEntity } from './position.entity';
import { In, Repository } from 'typeorm';
import { Position } from './position.interface';
import { PositionMapperService } from './position-mapper.service';

@Injectable()
export class PositionService {
  constructor(
    @InjectRepository(PositionEntity)
    private repo: Repository<PositionEntity>,
    private mapper: PositionMapperService,
  ) {}

  async findPositionsFor(identifiers: string[]) {
    const positions = await this.repo.find({
      where: { id: In(identifiers) },
    });
    return positions.map((pos) => this.mapper.toPosition(pos));
  }

  async savePositions(positions: Position[]) {
    const entities = positions.map((pos) => this.mapper.toEntity(pos));
    const saved = await this.repo.save(entities);
    return saved.map((pos) => this.mapper.toPosition(pos));
  }

  async delete(strings: string[]) {
    await this.repo.delete({ id: In(strings) });
  }
}
