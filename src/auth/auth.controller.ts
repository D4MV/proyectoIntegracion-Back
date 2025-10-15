import { Body, Controller, Post, Res, Get, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './DTO/login.dto';
import type { Response } from 'express';
import { AuthGuard } from './guard/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async loginDoctor(@Body() loginDto: LoginDto, @Res({passthrough: true}) res:Response) {
    return this.authService.loginDoctor(loginDto, res);
  }

  @Post('logout')
  async logout(@Res({passthrough:true}) res: Response) {
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/'
    });
    console.log('Logout: cookie eliminada desde el controlador');
    return { message: 'Sesión cerrada con éxito' };
  }


  @Get('profile')
  @UseGuards(AuthGuard)
  profile(@Request() req) { 

    const {id, email, role, nombre, apellido} = req.user;
    return {
      user: {
        id,
        email,
        role,
        nombre,
        apellido
      }
    };
  }
}


