import { Controller, Get, Param } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { RegistroDocDTO } from './DTO/registroDoc';
import { Body, Post } from '@nestjs/common';

@Controller('doctor')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

    @Post('register')
    register(@Body() registroDocDTO: RegistroDocDTO) {
        console.log('Registrando doctor:', registroDocDTO);
        return this.doctorService.register(registroDocDTO);
    }

    @Get('especialidad/:especialidad')
    getDoctorsByEspecialidad(@Param('especialidad') especialidad: string) {
        return this.doctorService.getDoctorByEspecialidad(especialidad);
    }
}
