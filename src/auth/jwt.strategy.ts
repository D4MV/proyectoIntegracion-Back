import Injectable from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { jwtConstants } from './constants/jwt.constants';
import { JwtService } from '@nestjs/jwt';
/*
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(private prisma: PrismaService, private jwtService: JwtService) {
}*/