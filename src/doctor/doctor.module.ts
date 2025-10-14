import { Module } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { DoctorController } from './doctor.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports:[EmailModule],
  controllers: [DoctorController],
  providers: [DoctorService, PrismaService],
})
export class DoctorModule {}
