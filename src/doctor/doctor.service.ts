import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegistroDocDTO } from './DTO/registroDoc';
import * as bcrypt from 'bcrypt';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class DoctorService {
    constructor(private prisma: PrismaService, private emailService: EmailService) {}

    async register(registroDocDTO: RegistroDocDTO) {
        const { 
            nombre, Rut, apellido, email, telefono, direccion, fecha_nacimiento,
            latitud, longitud, especialidad,password, descripcion_profesional, prevision_salud 
        } = registroDocDTO;
        
        const existeDoctor = await this.prisma.user.findUnique({
            where: { Rut }
        });
        
        if(existeDoctor) {
            throw new Error('El doctor ya existe');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        try {
            const nuevoDoctor = await this.prisma.user.create({
                data: {
                    nombre,
                    Rut,
                    apellido,
                    email,
                    telefono,
                    direccion,
                    fecha_nacimiento,
                    longitud,
                    latitud,
                    especialidad,
                    password_hash: hashedPassword,
                    descripcion_profesional,
                    prevision_salud,
                    role: 'DOCTOR' 
                }
            });

            await this.emailService.enviarEmailBienvenida({
                nombre:nuevoDoctor.nombre,
                apellido:nuevoDoctor.apellido,
                email:nuevoDoctor.email
            })
            
            return nuevoDoctor;
        } catch (error) {
            throw new Error('Error al crear el doctor: ' + error.message);
        }
    }

    async getDoctorByEspecialidad(especialidad: string) {

        return this.prisma.user.findMany({
            where: {
                role: 'DOCTOR',
                especialidad: especialidad
            },
            include:{
                citasComoDoctor:true
            }
        })
    }

    async getDoctorById(doctorId: string) {
        const doctor = await this.prisma.user.findUnique({
            where: { 
                id: doctorId,
                role: 'DOCTOR'
            }
        });

        if (!doctor) {
            throw new Error('Doctor no encontrado');
        }

        return doctor;
    }

    async getAllDoctores() {
        return this.prisma.user.findMany({
            where: { role: 'DOCTOR' },
            select: {
                id: true,
                nombre: true,
                apellido: true,
                email: true,
                telefono: true,
                descripcion_profesional: true,
                calificacion_promedio: true
            }
        });
    }


    async updateDoctor(doctorId: string, updateData: Partial<RegistroDocDTO>) {
        if (!updateData || Object.keys(updateData).length === 0) {
            throw new Error('No se proporcionaron datos para actualizar');
        }

        const camposPermitidos = [
            'nombre', 'apellido', 'email', 'telefono', 'direccion', 
            'fecha_nacimiento', 'latitud', 'longitud', 'especialidad', 
            'descripcion_profesional', 'prevision_salud'
        ];

        const camposInvalidos = Object.keys(updateData).filter(
            campo => !camposPermitidos.includes(campo)
        );

        if (camposInvalidos.length > 0) {
            throw new Error('Campos inválidos: ' + camposInvalidos.join(', '));
        }

        try {
            const nuevoDoctor = await this.prisma.user.update({
                where: { id: doctorId },
                data: updateData
            })

        return nuevoDoctor;

        }catch (error) {
            console.error('Error al actualizar el doctor:', error);
            throw new Error('No se pudo actualizar el doctor. Verifica los datos proporcionados.');}

    }
}
