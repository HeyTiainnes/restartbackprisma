import { Injectable } from '@nestjs/common';
import * as nodemailer from "nodemailer";


@Injectable()
export class MailerService {

    private async transporter() {
        const testAccount = await nodemailer.createTestAccount()
        const transport = nodemailer.createTransport({
            host: "localhost",
            port: 1025,
            ignoreTLS: true,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass
            }
        })
        return transport
    }
    async sendSignupConfirmation(userEmail: string) {
        (await this.transporter()).sendMail({
            from: "app@localhost.com",
            to: userEmail,
            subject: 'inscription confirmée',
            html: "<h3>Confirmation d'inscription</h3>"
        })
    }
}
