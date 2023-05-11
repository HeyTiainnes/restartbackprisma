import { Body, Controller, Post } from '@nestjs/common';
import { SignupDto } from './dto/signupDto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

    //injection de la logique metier depuis le service
    constructor(private readonly serviceAuth: AuthService) { }
    // ensuite on peut referencer la methode qui se trouve dans AuthService (cf return this....)
    @Post('signup')
    //@Body : on recupere les données du client, avec le type dto
    signup(@Body() signupDto: SignupDto) {
        return console.log("signup : OKAY !!!!! "); this.serviceAuth.signup(signupDto)



    }
}
