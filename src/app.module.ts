import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppServices } from './app.service';
import { AuthModule } from './auth/auth.module';
import { Role, User, UserRoleMapping } from './auth/entities';
import {
  Task,
  TaskStatus,
  TaskStatusHistory,
  UserTaskMapping,
} from './task/entities';
import { TaskModule } from './task/task.module';
import { UsersModule } from './users/users.module';
import { TaskStatusModule } from './taskStatus/taskStatus.module';

@Module({
  imports: [
    AuthModule,
    TaskModule,
    UsersModule,
    TaskStatusModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'Golu@1234',
      database: 'todo',
      entities: [
        User,
        Role,
        UserRoleMapping,
        Task,
        TaskStatusHistory,
        UserTaskMapping,
        TaskStatus,
      ],
      synchronize: false,
    }),
    TypeOrmModule.forFeature([
      User,
      Role,
      UserRoleMapping,
      Task,
      TaskStatusHistory,
      UserTaskMapping,
      TaskStatus,
    ]),
  ],
  controllers: [AppController],
  providers: [AppServices],
})
export class AppModule {}
