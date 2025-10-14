import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PacienteModule } from './paciente/paciente.module';
import { CitaModule } from './cita/cita.module';
import { DoctorModule } from './doctor/doctor.module';
import { EmailModule } from './email/email.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [ PacienteModule, CitaModule, DoctorModule, EmailModule,
    ConfigModule.forRoot({ isGlobal: true,}),
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
