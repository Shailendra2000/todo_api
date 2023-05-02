import { Controller, Get, UseGuards } from "@nestjs/common";
import { RequestGuard } from "../../task/guards/request.guard";
import { AdminGuard } from "../../task/guards/admin.guard";
import { UsersService } from "../services/users.service";

@Controller('users')
export class UsersController{

    constructor(private usersService : UsersService){}

    @Get()
    @UseGuards(RequestGuard,AdminGuard)
    async get(){
        const users = await this.usersService.getUserList()
        return {'forAdmin':true,'users':users}
    }
}