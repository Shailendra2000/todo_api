import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { TaskModule } from "../task/task.module";
import { UsersController } from "./controllers/users.controller";
import { UsersService } from "./services/users.service";

@Module({
    imports:[AuthModule,TaskModule],
    controllers:[UsersController],
    providers:[UsersService],
    exports:[]
})
export class UsersModule{}
