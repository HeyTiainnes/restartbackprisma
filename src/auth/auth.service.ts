import { ConflictException, Injectable } from '@nestjs/common';
import { SignupDto } from './dto/signupDto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { MailerService } from 'src/mailer/mailer.service';
//import { PrismaClient } from '@prisma/client'

@Injectable()
export class AuthService {
    constructor(private readonly prismaService: PrismaService, private readonly mailerService: MailerService) { }

    async signup(signupDto: SignupDto) {
        const { email, password, username } = signupDto
        // await this.prismaService.user
        const user = await this.prismaService.user.findUnique({ where: { email } });
        if (user) throw new ConflictException("user alerady exist");
        const hash = await bcrypt.hash(password, 10);
        await this.prismaService.user.create({ data: { email, username, password: hash }, });
        await this.mailerService.sendSignupConfirmation(email);
        return { data: 'user succesfully created' }
        throw new Error('Method not implemented.');
    }
}
