import { IsString, IsNotEmpty, IsDateString } from 'class-validator';

export class CrearDisponibilidadDto {
  @IsDateString()
  @IsNotEmpty()
  fecha: string;

  @IsString()
  @IsNotEmpty()
  horaInicio: string;

  @IsString()
  @IsNotEmpty()
  horaFin: string;

  @IsString()
  @IsNotEmpty()
  userId: string;
}