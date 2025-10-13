import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegistroPacDTO } from './DTO/registropac';

@Injectable()
export class PacienteService {
    constructor(private prisma: PrismaService) {}


    async register(RegistroPacDTO: RegistroPacDTO) {
        const { nombre, Rut, apellido, email, telefono, direccion, fecha_nacimiento, latitud, longitud } = RegistroPacDTO;

        const existePaciente = await this.prisma.user.findUnique({
            where:{ Rut }
        });

        if(existePaciente) {
            throw new Error('El paciente ya existe');
        }

        try {
            const nuevoPaciente = await this.prisma.user.create({
                data: {
                    nombre,
                    Rut,
                    apellido,
                    email,
                    telefono,
                    direccion,
                    fecha_nacimiento,
                    longitud: longitud,
                    latitud: latitud
                }
            })

            return nuevoPaciente;
        } catch (error) {
            throw new Error('Error al crear el paciente' + error.message);
        }    
    }

    async getPaciente(Rut: string) {
        const paciente = await this.prisma.user.findUnique({
            where: { Rut }
        });

        if (!paciente) {
            throw new Error('Paciente no encontrado');
        }
        return paciente;
    }
}
