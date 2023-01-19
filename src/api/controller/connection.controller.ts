import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Core')
@Controller("/core/connection")
export class ConnectionController {
    constructor() { }
}
