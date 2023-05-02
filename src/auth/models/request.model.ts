import { IsString, IsEmail, IsDefined} from "class-validator";

export class SignUpR{
    @IsString()
    @IsDefined()
    username:string;

    @IsEmail()
    @IsDefined()
    email:string;
    
    @IsString()
    @IsDefined()
    password:string
}

export class SignInR{
    @IsEmail()
    @IsDefined()
    email:string;

    @IsString()
    @IsDefined()
    password:string
}