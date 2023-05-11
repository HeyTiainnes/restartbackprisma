import { IsEmail, IsNotEmpty } from "class-validator";



export class SignupDto {
    //definition des propritétés que l'on doit recevoir
    @IsNotEmpty()
    readonly username: string;
    @IsNotEmpty()
    @IsEmail()
    readonly email: string;
    @IsNotEmpty()
    readonly password: string;

    // on peut aussi dans les dto, "performer" la validation
    // cf nest doc : ==> npm i --save class-validator class-transformer
    // MAIS pas encore "actif" voir main.ts : app.useGlonalPipes(new ValidationPipe())
}