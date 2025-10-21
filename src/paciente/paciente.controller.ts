import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PacienteService } from './paciente.service';
import { RegistroPacDTO } from './DTO/registropac';

@Controller('paciente')
export class PacienteController {
  constructor(private readonly pacienteService: PacienteService) {}
  
  @Post('register')
  register(
    @Body() registroPacDTO: RegistroPacDTO
  ){
    return this.pacienteService.register(registroPacDTO);
  }

  @Get('/Rut/:Rut')
  getPaciente(
    @Param('Rut') Rut: string
  ){
    return this.pacienteService.getPaciente(Rut);
  }
}