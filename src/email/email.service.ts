import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailService } from '@sendgrid/mail';


interface Doctor {
    nombre: string;
    apellido: string;
    email: string;
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
}
