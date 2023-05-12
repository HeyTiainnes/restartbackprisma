import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { SignupDto } from './dto/signupDto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { MailerService } from 'src/mailer/mailer.service';
import { SigninDto } from './dto/siginDto';
import { Await } from 'react-router-dom';
import { NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
//import { PrismaClient } from '@prisma/client'

@Injectable()
export class AuthService {
    async signin(signinDto: SigninDto) {
        //Verifier si user déja inscrit
        const { email, password } = signinDto
        const user = await this.prismaService.user.findUnique({ where: { email } })
        // si non iscrit :
        if (!user) throw new NotFoundException(`Allons !!! un peu de concentration IL FAUT S'INSCRIRE AVANT DE SE CONNECTER!!!!!`)
        // comparer password
        const match = await bcrypt.compare(password, user.password)
        // si pas bon password:
        if (!match) throw new UnauthorizedException('Soit mail, soit password ne sont pas bons !!!')
        // si ok : generation du token
        const payload = {
            sub: user.userId,
            email: user.email
        }
        const token = this.jwtService.sign(payload, { expiresIn: "30m", secret: this.configService.get("SECRET_KEY"), });
        return {
            token,
            user: {
                username: user.username,
                email: user.email,
            }

        }
        throw new Error('Method not implemented.');
    }
    constructor(private readonly prismaService: PrismaService,
        private readonly mailerService: MailerService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) { }

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
