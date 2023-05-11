import { ConflictException, Injectable } from '@nestjs/common';
import { SignupDto } from './dto/signupDto';
import { PrismaService } from 'src/prisma/prisma.service';
//import { PrismaClient } from '@prisma/client'

@Injectable()
export class AuthService {
    constructor(private readonly prismaService: PrismaService) { }
    // en general qd comm avec BDD c asynchrone
    async signup(signupDto: SignupDto) {
        const { email, password, username } = signupDto
        //logique metier du signup ::::
        //=> requette et comparaison 
        // creation module prisma : nest g mo prisma et nest g s prisma
        //==> creation files dans src/prima
        // cf don nest : npm install @prisma/client pour crud

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //Verifier si user deja inscrit
        // ici prismaClient va directement chercher ce dont on a besoin 
        await this.prismaService.user
        const user = await this.prismaService.user.findUnique({ where: { email } })
        //si j'ai deja un user, j envoie une erreur
        if (user) throw new ConflictException("user alerady exist");
        //Hasher password

        //Enr user ds bdd
        //envoyer mail confirm
        //reponse succes




        throw new Error('Method not implemented.');
    }
}
