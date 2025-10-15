import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { jwtConstants } from './constants/jwt.constants';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(private prisma: PrismaService, private jwtService: JwtService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request:Request) => {
                    return request?.cookies?.['access_token']
                }
            ]),
            secretOrKey : jwtConstants.secret,
            ignoreExpiration: false,
        });
    }

    async validate(payload: any) {

        const user = await this.prisma.user.findUnique({
            where: { id: payload.sub },
            select: {id: true, email:true, role:true, nombre:true, apellido:true}
        })

        if (!user) 
         throw new UnauthorizedException('Usuario no encontrado');

        if (payload.role !== user.role){
            throw new UnauthorizedException('Solo los doctores pueden acceder a esta ruta');
        }
        return user;

    }


}