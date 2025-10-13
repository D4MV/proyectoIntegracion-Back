import { Body, Controller, Post, Put } from '@nestjs/common';
import { CitaService } from './cita.service';
import { CrearDisponibilidadDto } from './DTO/crearCita';
import { Get, Param } from '@nestjs/common';

@Controller('cita')
export class CitaController {
  constructor(private readonly citaService: CitaService) {}

 @Post('crear')
 crearDisponibilidad(
  @Body() crearDisponibilidadDto: CrearDisponibilidadDto
 ) {
    return this.citaService.crearDisponibilidad(crearDisponibilidadDto);
 }

 @Get('usuario/:userId/fecha/:fecha')
 async obtenerCitasPorUsuarioYFecha(
  @Param('userId') userId: string,
  @Param('fecha') fecha: string
 ) {
    return this.citaService.obtenerCitasPorUsuario(userId, new Date(fecha));
 }

 @Put('reservar/:citaId/paciente/:pacienteId')
 async reservarCita(
  @Param('citaId') citaId: string,
  @Param('pacienteId') pacienteId: string
 ) {
    return this.citaService.reservarCita(citaId, pacienteId);
 }
}