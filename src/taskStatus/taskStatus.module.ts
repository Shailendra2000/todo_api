import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "../auth/auth.module";
import { Module } from "@nestjs/common";
import { TaskStatusController } from "./controllers/taskStatus.controller";
import {Role,User} from '../auth/entities/index'
import { TaskStatusHistory } from "../task/entities/index";
import { TaskStatusService } from "./services/taskStatus.services";
import {Task,TaskStatus,UserTaskMapping} from '../task/entities/index'
import { TaskModule } from "../task/task.module";

@Module({
    imports:[AuthModule,TaskModule,
    TypeOrmModule.forFeature([Task,TaskStatusHistory,TaskStatus,UserTaskMapping,User]),
    JwtModule.register({global:true,secret:'Mysecret@1',signOptions:{expiresIn:'24h'}}),
    ],
    controllers:[ TaskStatusController],
    providers:[TaskStatusService],
    exports:[TaskStatusService]
})

export class TaskStatusModule {};