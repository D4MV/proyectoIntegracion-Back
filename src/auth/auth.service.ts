import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { LoginDto } from './DTO/login.dto';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwtService: JwtService) {}

    async loginDoctor(loginDto:LoginDto, res:Response){
        const {email, password} = loginDto;

        const user = await this.prisma.user.findUnique({
            where: {
                email,
                role: 'DOCTOR'
            }
        });

        if(!user || !user.password_hash || !(await bcrypt.compare(password, user.password_hash))){
            throw new UnauthorizedException('Credenciales inválidas');
        }
        return this.generateToken(user, res);
    }

    async generateToken(user:any, res:Response){
        const payload = { sub: user.id, email: user.email, role: user.role };

        const token = this.jwtService.sign(payload);


        res.cookie('access_token', token, {
            httpOnly: true,
            secure: false, 
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000,
            path: '/'
        });
        

        console.log('Token generado:', token);
        
        return {
            token, 
            user: {
                id: user.id,
                email: user.email,
                apellido: user.apellido,
                nombre: user.nombre,
                role: user.role
            }
        };
    }

    logout(res:Response){
        res.clearCookie('access_token', {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            path: '/'
        });
        console.log('Cookie eliminada');
        return {message: 'Sesión cerrada con éxito'};
    }
}
