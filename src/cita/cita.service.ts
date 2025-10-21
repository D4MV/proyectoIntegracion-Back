import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CrearDisponibilidadDto } from './DTO/crearCita';
import { EmailService } from 'src/email/email.service';
import { PrismaClientUnknownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class CitaService {
    constructor(private prisma: PrismaService, private emailService: EmailService) {}

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

        const buscarCita = await this.prisma.cita.findUnique({
            where: { id: citaId }
        })

        if(!buscarCita) {
            throw new Error('La cita no existe');
        }

        const doctor = await this.prisma.user.findUnique({
            where: { id: buscarCita.doctorId}
        })

        if(!paciente || paciente.role !== "PACIENTE") {
            throw new Error('Sólo los pacientes pueden reservar citas');
        }

        if(!doctor || doctor.role !== "DOCTOR") {
            throw new Error('La cita debe estar asociada a un doctor válido');
        }

        const cita = await this.prisma.cita.findUnique({
            where: { id: citaId },
            include: { doctor: true, paciente: true }
        });

        if(!cita || cita.estado !== 'DISPONIBLE') {
            throw new Error('La cita no está disponible para ser reservada');
        }

        const citaActualizada = this.prisma.cita.update({
            where: { id: citaId },
            data: { estado: 'RESERVADA', pacienteId: pacienteId },
            include:{ doctor:true, paciente:true }
        })

        const datosDoctor = {
            nombre: doctor.nombre,
            apellido: doctor.apellido,
            email: doctor.email,
        }

        const datosPaciente = {
            nombre: paciente.nombre,
            apellido: paciente.apellido,
            email: paciente.email,
        }

        const fechaFormateada = new Date(cita.fecha)
            .toLocaleString('es-CL', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });


        const datosCita = {
            fecha: cita.fecha,
            fechaFormateada: fechaFormateada,
            horaInicio: cita.horaInicio,
            horaFin: cita.horaFin,
        }

        try {
            await this.emailService.enviarConfirmacionCita(
                datosPaciente,
                datosDoctor,
                datosCita
            );
        return citaActualizada;
        } catch (error) {
            throw new Error('Error al enviar el email de confirmación: ' + error.message
            )
        }
    }

    async obtenerCitasPorDoctor(doctorEmail: string) {
        const citas = await this.prisma.cita.findMany({
            where: { doctor: { email: doctorEmail }, estado: 'RESERVADA' },
            include: {
                paciente: true
            }
        });

        if(!citas) {
            throw new Error('No se encontraron citas para este doctor');
        }

        return citas;
    }

    async obtenerCitasPorPaciente(pacienteRut: string) {
        const citas = await this.prisma.cita.findMany({
            where: { paciente: { Rut: pacienteRut }, estado: 'RESERVADA' },
            include: { doctor: true }
        });

        if(!citas) {
            throw new Error('Paciente no encontrado');
        }

        return citas;
    }

    async cancelarCita(citaId: string) {
        if(!citaId) {
            throw new Error('El ID de la cita es obligatorio para cancelar');
        }
        const cita = await this.prisma.cita.update({
            where: { id: citaId },
            data: { estado: 'DISPONIBLE' },
            include: { doctor: true, paciente: true }
        })

        const datosDoctor = {
            nombre: cita.doctor.nombre,
            apellido: cita.doctor.apellido,
            email: cita.doctor.email,
        }

        if(!cita.paciente) {
            throw new Error('La cita no tiene un paciente asociado');
        }

        const datosPaciente = {
            nombre: cita.paciente.nombre,
            apellido: cita.paciente.apellido,
            email: cita.paciente.email,
        }

        const datosCita = {
            fecha: cita.fecha,
            horaInicio: cita.horaInicio,
            horaFin: cita.horaFin,
        }

        try {
            await this.emailService.notificacionCancelacionCita(
                datosPaciente,
                datosDoctor,
                datosCita
            );
        return cita;
        } catch (error) {
            throw new Error('Error al enviar el email de confirmación: ' + error.message
            )
        }
    }

}
