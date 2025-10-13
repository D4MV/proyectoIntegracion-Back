import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PacienteModule } from './paciente/paciente.module';
import { CitaModule } from './cita/cita.module';
import { DoctorModule } from './doctor/doctor.module';

@Module({
  imports: [ PacienteModule, CitaModule, DoctorModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
