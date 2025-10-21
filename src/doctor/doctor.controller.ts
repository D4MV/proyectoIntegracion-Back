import { Controller, Get, Param, Patch } from '@nestjs/common';
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

    @Patch("id/:id")
    updateDoctor(
        @Param('id') doctorId: string,
        @Body() updateData: Partial<RegistroDocDTO>
    ) {
        console.log(`Actualizando doctor con ID: ${doctorId}`, updateData);
        return this.doctorService.updateDoctor(doctorId, updateData);
    }
}
