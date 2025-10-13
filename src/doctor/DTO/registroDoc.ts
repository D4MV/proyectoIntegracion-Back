import { IsNotEmpty, IsString, IsEmail, IsDate, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class RegistroDocDTO {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  Rut: string;

  @IsString()
  @IsNotEmpty()
  apellido: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  telefono: string;

  @IsString()
  @IsNotEmpty()
  direccion: string;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  fecha_nacimiento: Date;

  @IsNumber()
  @IsNotEmpty()
  latitud: number;

  @IsNumber()
  @IsNotEmpty()
  longitud: number;

  // Campos específicos para doctores

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  especialidad: string;

  @IsString()
  @IsOptional()
  descripcion_profesional?: string;

  @IsString()
  @IsOptional()
  prevision_salud?: string;
}