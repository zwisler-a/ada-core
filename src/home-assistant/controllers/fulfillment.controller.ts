import { Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/strategies/jwt.strategy';
import { GoogleHomeFulfillmentService } from '../fulfillment.service';

@ApiTags('Google Home')
@Controller("/assistant")
export class GoogleHomeFulfillmentController {
    constructor(private homeAssistantService: GoogleHomeFulfillmentService) { }

    @UseGuards(JwtAuthGuard)
    @Post("fulfillment")
    authorize(@Req() req, @Res() res): void {
        this.homeAssistantService.app(req, res)
    }
}
