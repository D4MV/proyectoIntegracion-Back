import { IsDateString, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class RegistroPacDTO {
    @IsString()
    @IsNotEmpty()
    nombre: string;

    @IsString()
    @IsNotEmpty()
    Rut: string;
    
    @IsString()
    @IsNotEmpty()
    apellido: string;

    @IsString()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    telefono: string;

    @IsString()
    @IsNotEmpty()
    direccion: string;

    @IsDateString()
    @IsNotEmpty()
    fecha_nacimiento: Date;

    @IsNotEmpty()
    latitud: number;

    @IsNotEmpty()
    longitud: number;
}
