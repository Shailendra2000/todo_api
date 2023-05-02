import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt/dist";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "..//auth/auth.module";
import { Role, User, UserRoleMapping } from "../auth/entities";
import { TaskController } from "./controllers/task.controller";
import { Task, TaskStatus, TaskStatusHistory, UserTaskMapping } from "./entities";
import { RequestGuard } from "./guards/request.guard";
import { TaskStatusHistoryRepository } from "./repositories/task-status-history.repository";
import { TaskStatusRepository } from "./repositories/task-status.repository";
import { TaskRepository } from "./repositories/task.repository";
import { TaskService } from "./services/task.service";
import { AdminGuard } from "./guards/admin.guard";
import { PaginationMiddleware } from "./middlewares/pagination.middleware";

@Module({
    imports:[AuthModule,
    TypeOrmModule.forFeature([Task,TaskStatusHistory,TaskStatus,UserTaskMapping,User]),
    JwtModule.register({global:true,secret:'Mysecret@1',signOptions:{expiresIn:'24h'}}),
    ],
    controllers:[TaskController],
    providers:[TaskService,TaskRepository,RequestGuard,TaskStatusHistoryRepository,TaskStatusRepository,AdminGuard],
    exports:[TaskRepository,RequestGuard,TaskStatusHistoryRepository,TaskStatusRepository,AdminGuard]
})

export class TaskModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
          .apply(PaginationMiddleware)
          .forRoutes({ path: '/task', method: RequestMethod.GET });
      }
};