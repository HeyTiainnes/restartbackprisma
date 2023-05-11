import { Body, Controller, Post } from '@nestjs/common';
import { SignupDto } from './dto/signupDto';

@Controller('auth')
export class AuthController {
    @Post('signup')
    //@Body : on recupere les données du client, avec le type dto
    signup(@Body() registerDto: SignupDto) {
        return "signup : OKAY !!!!! "
    }
}
