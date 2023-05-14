import { Body, Controller, Post } from '@nestjs/common';
import { SignupDto } from './dto/signupDto';
import { AuthService } from './auth.service';
import { SigninDto } from './dto/siginDto';
import { ResetPasswordDemandDto } from './dto/resetPasswordDemandDto';
import { ResetPasswordConfirmationDto } from './dto/resetPasswordConfirmationDto'
@Controller('auth')
export class AuthController {
    //injection de la logique metier depuis le service
    constructor(private readonly authService: AuthService) { }
    // ensuite on peut referencer la methode qui se trouve dans AuthService (cf return this....)
    @Post('signup')
    //@Body : on recupere les données du client, avec le type dto
    signup(@Body() signupDto: SignupDto) {
        return this.authService.signup(signupDto)
    }
    @Post('signin')
    //@Body : on recupere les données du client, avec le type dto
    signin(@Body() signinDto: SigninDto) {
        return this.authService.signin(signinDto)
    }
    @Post('reset-password')
    resetPasswordDemand(@Body() resetPasswordDemandDto: ResetPasswordDemandDto) {
        return this.authService.resetPasswordDemand(resetPasswordDemandDto)
    }
    @Post('reset-password-confirmation')
    resetPasswordConfirmation(@Body() resetPasswordConfirmationDto: ResetPasswordConfirmationDto) {
        return this.authService.resetPasswordConfirmation(resetPasswordConfirmationDto)
    }
}
