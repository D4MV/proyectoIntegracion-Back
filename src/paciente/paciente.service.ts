import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegistroPacDTO } from './DTO/registropac';

@Injectable()
export class PacienteService {
    constructor(private prisma: PrismaService) {}


    async register(RegistroPacDTO: RegistroPacDTO) {
        const { nombre, Rut, apellido, email, telefono, direccion, fecha_nacimiento } = RegistroPacDTO;

        const existePaciente = await this.prisma.user.findUnique({
            where:{ Rut: Rut }
        });

        if(existePaciente) {
            throw new Error('El paciente ya existe');
        }

        const existeEmail = await this.prisma.user.findUnique({
            where: { email: email }
        });

        if (existeEmail) {
            throw new Error('El email ya está en uso');
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
                    role: 'PACIENTE'
                }
            })

            return nuevoPaciente;
        } catch (error) {
            throw new Error('Error al crear el paciente' + error.message);
        }    
    }

    async getPaciente(Rut: string) {
        const paciente = await this.prisma.user.findUnique({
            where: { Rut: Rut }
        });

        if (!paciente) {
            throw new Error('Paciente no encontrado');
        }
        return paciente;
    }
}
