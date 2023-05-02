import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Patch,
  Post,
  Put,
  Query,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { RequestGuard } from '../guards/request.guard';
import { AddTaskDto, UpdateTaskDto } from '../dto/task.dto';
import { TaskService } from '../services/task.service';
import { HttpStatusCode } from 'axios';

@Controller('task')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @UseGuards(RequestGuard)
  @Get()
  async get(
    @Req() req: Request,
    @Query('userId') userId,
    @Query('statusId') statusID,
  ) {
    const user = req['user'];
    if (!userId) {
      userId = user.id;
    }
    const { page, limit } = req['pagination'];
    const { tasksList, total } =
      await this.taskService.fetchTasksByStatusPagination(
        userId,
        statusID,
        Number(page),
        Number(limit),
      );
    return { tasks: await tasksList, total: total };
  }

  @UseGuards(RequestGuard)
  @Post()
  async add(
    @Request() req: Request,
    @Query('userId') userId,
    @Body() task: AddTaskDto,
  ) {
    try {
      const user = req['user'];
      console.log(task)
      return await this.taskService.create(
        user.id,
        userId,
        task.title,
        task.desc,
        Number(task.statusId),
      );
    } catch (e) {
      throw new HttpException('Cant create', HttpStatusCode.BadRequest);
    }
  }

  @UseGuards(RequestGuard)
  @Put()
  async update(
    @Request() req: Request,
    @Query('userId') userId,
    @Body() task: UpdateTaskDto,
  ) {
    try {
      const user = req['user'];
      return await this.taskService.update(userId ? userId : user.id, task);
    } catch (e) {
      throw new HttpException('Cant update', HttpStatusCode.BadRequest);
    }
  }

  @UseGuards(RequestGuard)
  @Delete()
  async remove(
    @Request() req: Request,
    @Query('userId') userId,
    @Query('id') taskId: string,
  ) {
    try {
      const user = req['user'];
      return await this.taskService.deleteTask(userId?userId:user.id, taskId);
    } catch (e) {
      throw new HttpException('Cant delete', HttpStatusCode.BadRequest);
    }
  }
}
