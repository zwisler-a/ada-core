import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from '../auth.service';
import { GoogleService } from '../services/google.service';

@ApiTags('Authentication')
@Controller("/auth/google")
export class GoogleController {
    constructor(private googleService: GoogleService, private authService: AuthService) { }

    @Get()
    @UseGuards(AuthGuard('google'))
    async googleAuth(@Req() req) { }

    @Get('redirect')
    @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(@Req() req, @Res() res) {
        const user = await this.googleService.registerOrAuthenticate(req.user);
        const token = this.authService.createAccessToken(user);
        const redirect = req.cookies.redirect
        res.cookie('auth', token);
        if(redirect) {
            res.clearCookie('redirect')
            res.redirect(Buffer.from(redirect, 'base64').toString())
        } else {
            res.redirect('/')
        }
    }

}
