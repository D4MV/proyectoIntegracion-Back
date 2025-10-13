import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CrearDisponibilidadDto } from './DTO/crearCita';

@Injectable()
export class CitaService {
    constructor(private prisma: PrismaService){}

    async crearDisponibilidad(crearDisponibilidadDto: CrearDisponibilidadDto){

        const { fecha, horaInicio, horaFin, userId } = crearDisponibilidadDto;


        const doctor = await this.prisma.user.findUnique({
            where: { id: userId, role: 'DOCTOR' },
        })


        if(!doctor){
            throw new Error('Sólo los doctores pueden crear disponibilidades');
        }

        if (doctor.role !== 'DOCTOR') {
            throw new Error('Sólo los doctores pueden crear disponibilidades');
        }

        try {
            const nuevaCita = await this.prisma.cita.create({
                data: { fecha, horaInicio, horaFin, doctorId: userId  }
            })

            return nuevaCita;
        } catch (error) {
            if(error.code === 'P2002'){
                throw new Error('Ya existe una cita para este usuario en la misma fecha y hora de inicio');
            }
            throw new Error('Error al crear la cita'+error.message);
        }
    }

    async obtenerCitasPorUsuario(userId:string, fecha: Date) {
        const inicioDia = new Date(fecha.setHours(0, 0, 0, 0));
        const finDia = new Date(fecha.setHours(23, 59, 59, 999));

        return this.prisma.cita.findMany({
            where: {
                doctorId: userId,
                fecha: { gte: inicioDia, lte: finDia }
            }
        })
    }

    async reservarCita(citaId: string, pacienteId: string) {
        const paciente = await this.prisma.user.findUnique({
            where: { id: pacienteId }
        });

        if(!paciente || paciente.role !== "PACIENTE") {
            throw new Error('Sólo los pacientes pueden reservar citas');
        }

        const cita = await this.prisma.cita.findUnique({
            where: { id: citaId }
        });

        if(!cita || cita.estado !== 'DISPONIBLE') {
            throw new Error('La cita no está disponible para ser reservada');
        }

        return this.prisma.cita.update({
            where: { id: citaId },
            data: { estado: 'RESERVADA', pacienteId: pacienteId }
        })
    }

}
