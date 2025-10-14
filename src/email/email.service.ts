import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailService } from '@sendgrid/mail';
import { from, Subject } from 'rxjs';


interface Doctor {
    nombre: string;
    apellido: string;
    email: string;
}

interface Paciente {
    nombre: string;
    apellido: string;
    email: string;
}

interface CitaReservada {
    fecha: Date;
    horaInicio: string;
    horaFin: string;

}


@Injectable()
export class EmailService {
    private sgMail: MailService;
    constructor(private configService: ConfigService) {

        this.sgMail = new MailService();

        const apiKey = this.configService.get<string>('SENDGRID_API_KEY');
            if (!apiKey) {
                throw new Error('SENDGRID_API_KEY is not defined');
            }
            this.sgMail.setApiKey(apiKey);
    }  

    async enviarEmailBienvenida(doctor:Doctor): Promise<boolean>{
        const mensaje = {
            to: doctor.email,
            from: this.configService.get<string>('EMAIL_FROM') || 'diego.moragavaldes2002@gmail.com',
            subject: 'Bienvenido a Mediapp',
            text: `Hola Dr. ${doctor.nombre}, tu cuenta ha sido creada con exito.`,
            html:`
            <div>
              <h1>Bienvenido a Mediapp</h1>
                <p>Hola Dr. ${doctor.nombre} ${doctor.apellido}</p>
                <p>Te invitamos a crear tus horas disponibles en el apartado ce "CREAR DISPONIBILIDAD"</p>
                <p>Esperamos que disfrutes de nuestra plataforma.</p>
            </div>
            `,
        };

        try {
            await this.sgMail.send(mensaje);
            return true;
        }catch (error){
            console.error('Error al enviar email:',error);
            return false;
        }

    }

    async enviarConfirmacionCita(paciente:Paciente, doctor:Doctor, cita:CitaReservada): Promise<boolean> {
        const mensaje = {
            to: paciente.email,
            from: this.configService.get<string>('EMAIL_FROM') || 'diego.moragavaldes2002@gmail.com',
            subject: 'Confirmación de Cita Médica',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
                    <h1 style="color: #3498db; text-align: center;">Cita Confirmada</h1>
                    
                    <p>Hola ${paciente.nombre} ${paciente.apellido},</p>
                    
                    <p>Tu cita médica ha sido reservada exitosamente con los siguientes detalles:</p>
                    
                    <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <p><strong>Fecha:</strong> ${cita.fecha}</p>
                    <p><strong>Hora:</strong> ${cita.horaInicio} - ${cita.horaFin}</p>
                    <p><strong>Doctor:</strong> ${doctor.nombre} ${doctor.apellido}</p>
                    </div>
                    
                    <p>Recuerda llegar 15 minutos antes de tu cita. Si necesitas cancelar o reprogramar, por favor hazlo con al menos 24 horas de anticipación.</p>
                    
                    <p>Gracias por confiar en nuestros servicios.</p>
                    
                    <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                    <p style="color: #777; font-size: 12px;">Este es un mensaje automático, por favor no respondas a este correo.</p>
                    </div>
                </div>
                `,
            };

        const mensajeDoctor ={
            to:doctor.email,
            from: this.configService.get<string>('EMAIL_FROM') || 'diego.moragavaldes2002@gmail.com',
            subject: 'Nueva Cita Reservada',
            html:`
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
                    <h1 style="color: #3498db; text-align: center;">Nueva Cita Agendada</h1>
                    
                    <p>Hola Dr. ${doctor.nombre} ${doctor.apellido},</p>
                    
                    <p>Se ha agendado una nueva cita para usted con los siguientes detalles:</p>
                    
                    <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <p><strong>Paciente:</strong> ${paciente.nombre} ${paciente.apellido}</p>
                    <p><strong>Fecha:</strong> ${cita.fecha}</p>
                    <p><strong>Hora:</strong> ${cita.horaInicio} - ${cita.horaFin}</p>}
                    </div>
                    
                    <p>Esta información ha sido enviada también al paciente.</p>
                    
                    <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                    <p style="color: #777; font-size: 12px;">Este es un mensaje automático, por favor no respondas a este correo.</p>
                    </div>
                </div>
                `,
        }
        try {
           await this.sgMail.send(mensaje);
           await this.sgMail.send(mensajeDoctor);
           return true;
        }catch (error){
           console.error('Error al enviar email:',error);
           return false;
        }
    }

}
