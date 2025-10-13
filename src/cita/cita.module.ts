import { Module } from '@nestjs/common';
import { CitaService } from './cita.service';
import { CitaController } from './cita.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [CitaController],
  providers: [CitaService, PrismaService],
})
export class CitaModule {}
