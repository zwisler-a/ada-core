import { Controller, Get, Post, Query, Req, Res, UseFilters, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from '../auth.service';
import { JwtAuthGuard } from '../strategies/jwt.strategy';
import { LocalAuthGuard } from '../strategies/local.strategy';
import { UnauthorizedFilter } from '../unauthorized.filter';

@ApiTags('Authentication')
@Controller("/auth")
export class AuthController {
    constructor(private authService: AuthService) { }


    @Get('login')
    login(
        @Res() res,
        @Query('redirect') redirect
    ) {
        res.cookie('redirect', redirect)
        res.redirect('/login/index.html');
        return;
    }

    @Get('logout')
    logout(
        @Res() res,
        @Query('redirect') redirect
    ) {
        res.clearCookie('redirect');
        res.clearCookie('auth');
        res.redirect('/login/index.html');
        return;
    }


    @UseGuards(LocalAuthGuard)
    @Post('login')
    async doLogin(@Req() req, @Res() res) {
        const access_token = this.authService.createAccessToken(req.user);
        const redirect = req.cookie.redirect;
        res.clearCookie('redirect');
        res.cookie('auth', access_token);
        if (redirect) {
            res.redirect(Buffer.from(redirect, 'base64').toString())
        } else {
            res.send({ access_token })
        }
    }

    @UseFilters(UnauthorizedFilter)
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Req() req) {
        return this.authService.getUser(req.user);
    }

}
