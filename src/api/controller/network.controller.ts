import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Core')
@Controller("/core/network")
export class NetworkController {
    constructor() { }
}
