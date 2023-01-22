import { Injectable } from '@nestjs/common';
import { Position } from './position.interface';
import { PositionEntity } from './position.entity';

@Injectable()
export class PositionMapperService {
  toEntity(position: Position) {
    const entity = new PositionEntity();
    entity.x = position.x;
    entity.y = position.y;
    entity.id = position.identifier;
    return entity;
  }

  toPosition(entity: PositionEntity): Position {
    return {
      x: entity.x,
      y: entity.y,
      identifier: entity.id,
    };
  }
}
