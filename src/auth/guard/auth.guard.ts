import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { jwtConstants } from '../constants/jwt.constants';
import { console } from 'inspector';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private readonly jwtService:JwtService){}

  async canActivate(context: ExecutionContext):Promise<boolean>{

    const request = context.switchToHttp().getRequest();


    console.log('Nueva solicitud de autenticación:')
    console.log('Método HTTP:', request.method);
    console.log('Ruta:', request.url);
    console.log('Headers de Autorización:', request.headers.authorization);
    console.log('Cookies disponibles:', request.cookies);
    
    const token = this.extractTokenFromCookie(request) || this.extractTokenFromHeader(request);
    
    console.log('Token encontrado:', !!token);
    if (token) {
      console.log('Primeros caracteres del token:', token.substring(0, 10) + '...');
    }

    if(!token){
      console.log('Error: No se proporcionó token');
      throw new UnauthorizedException('No token provided');
    }

    try {
      const payload = await this.jwtService.verifyAsync(
        token,
        {
          secret: jwtConstants.secret
        }
      );

      request.user = payload;
      console.log('Token válido, usuario autenticado:', payload);

    }catch(error){
      console.log('Error verificando token:', error.message);
      throw new UnauthorizedException('Invalid token');
    }

    return true;
  }

  private extractTokenFromCookie(request:Request):string | undefined{
    return request.cookies?.access_token;
  }

  private extractTokenFromHeader(request:Request):string | undefined{
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
