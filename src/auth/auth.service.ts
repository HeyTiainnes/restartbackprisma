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
import { ResetPasswordDemandDto } from './dto/resetPasswordDemandDto';
import * as speakeasy from 'speakeasy';
import { ResetPasswordConfirmationDto } from './dto/resetPasswordConfirmationDto';
import { DeleteAccountDto } from './dto/deleteAccountDto';
//import { PrismaClient } from '@prisma/client'

@Injectable()
export class AuthService {
    d

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
    async resetPasswordDemand(resetPasswordDemandDto: ResetPasswordDemandDto) {
        //throw new Error('Method not implemented.');
        const { email } = resetPasswordDemandDto;
        const user = await this.prismaService.user.findUnique({ where: { email } });
        if (!user) throw new NotFoundException(`not fund user`);

        const code = speakeasy.totp({
            secret: this.configService.get("OTO_CODE"),
            digits: 5,
            step: 60 * 15,
            encoding: "base32"
        })
        const url = "http://localhost:3000/auth/reset-password-confirmation"
        await this.mailerService.sendResetPassword(email, url, code)
        return { data: "msg reset psw sent" }
    }
    async resetPasswordConfirmation(resetPasswordConfirmation: ResetPasswordConfirmationDto) {
        const { code, email, password } = resetPasswordConfirmation;
        const user = await this.prismaService.user.findUnique({ where: { email } });
        if (!user) throw new NotFoundException(`don't exist this user`);
        const match = speakeasy.totp.verify({
            secret: this.configService.get('OTP_code'),
            token: code,
            digits: 5,
            step: 60 * 15,
            encoding: 'base32',
        });
        if (!match) throw new UnauthorizedException('Invalid/expired token')
        const hash = await bcrypt.hash(password, 10)
        await this.prismaService.user.update({ where: { email }, data: { password: hash } })
        return { data: 'password modifié :)' }
    }
    async deleteAccount(userId: number, deleteAccountDto: DeleteAccountDto) {
        const { password } = deleteAccountDto
        const user = await this.prismaService.user.findUnique({ where: { userId } });
        if (!user) throw new NotFoundException(`not fund passwordr lors de sa recherche pour delete account`);
        await this.prismaService.user.delete({ where: { userId } })
        console.log(`l'utilisateur ${user.username} avec le mail ${user.email} deleted`)
        return { data: `user ${user.username, user.username} deleted` }
    }
}
