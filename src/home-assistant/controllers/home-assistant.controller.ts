import { Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/strategies/jwt.strategy';
import { HomeAssistantService } from '../home-assistant.service';

@Controller("/assistant")
export class HomeAssistantFulfillmentController {
    constructor(private homeAssistantService: HomeAssistantService) { }

    @UseGuards(JwtAuthGuard)
    @Post("fulfillment")
    authorize(@Req() req, @Res() res): void {
        this.homeAssistantService.app(req, res)
    }
}
