import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { SignInGuard } from "../guards/signin.guard";
import { SignInR, SignUpR } from "../models/request.model";
import { AuthServices } from "../services";

@Controller()
export class AuthController{
    constructor(private authService:AuthServices){}

    @Post('/signup')
    async signup(@Body() creds:SignUpR){
        return await this.authService.signUp(creds.username,creds.email,creds.password)
    }

    @UseGuards(SignInGuard)
    @Post('/signin')
    async signin(@Body() creds:SignInR){
        return await this.authService.signIn(creds.email)
    }
}

