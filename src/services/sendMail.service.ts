import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import * as nodemailer from 'nodemailer'

@Injectable()
export class SendMailService {
    private transporter: nodemailer.Transporter

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'Gmail',
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASSWORD,
            }
        })
    }

    async sendMail(
        mailOptions: {
            from: string,
            to: string,
            subject: string,
            html: string
        }
    ) {

        try {
            await this.transporter.sendMail(mailOptions)

            return {
                statusCode: HttpStatus.OK,
                message: `Email sent to ${mailOptions?.to} successfully`,
            }
        } catch (error) {
            console.log(error)
            throw new HttpException('Failed to send email', HttpStatus.INTERNAL_SERVER_ERROR)
        }

    }

}
