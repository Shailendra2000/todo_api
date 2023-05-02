import { HttpException, Injectable } from '@nestjs/common';
import { HttpStatusCode } from 'axios';
import { User } from '../../auth/entities';
import { UserRepository } from '../../auth/repositories';
import { Task, TaskStatus, UserTaskMapping } from '../entities';
import { ITaskInfo } from '../interfaces/task-info.interface';
import { TaskStatusHistoryRepository } from '../repositories/task-status-history.repository';
import { TaskStatusRepository } from '../repositories/task-status.repository';
import { TaskRepository } from '../repositories/task.repository';
import { async } from 'rxjs';
import { UpdateTaskDto } from '../dto/task.dto';

@Injectable()
export class TaskService {
  constructor(
    private userRepository: UserRepository,
    private taskRepository: TaskRepository,
    private taskStatusHistoryRepository: TaskStatusHistoryRepository,
    private taskStatusRepository: TaskStatusRepository,
  ) {}

  public fetchTasksByStatusPagination = async (
    id: number,
    statusId: number = 3,
    page: number = 1,
    limit: number = Infinity,
  ) => {
    let user = await this.userRepository.getOneById(id);
    let status = await this.taskStatusRepository.getOneById(statusId);
    const { tasks, total } =
      await this.taskRepository.getUserTasksByStatusPagination(
        user,
        status,
        page,
        limit,
      );
    const tasksList = this.createReturnTaskList(tasks);
    return { tasksList, total };
  };

  public create = async (
    createdById: number,
    createdForId: number | undefined,
    title: string,
    desc: string,
    statusId: number,
  ) => {
    const user: User = await this.userRepository.getOneById(createdById);
    let forUser: User | undefined;
    if (await this.createdOwnTask(createdForId)) {
      forUser = user;
    } else {
      forUser = await this.userRepository.getOneById(createdForId);
    }

    const status = await this.taskStatusRepository.getOneById(statusId);
    await this.createTask(user, forUser, title, desc, status);
  };

  private async createTask(
    user: User,
    forUser: User,
    title: string,
    desc: string,
    status: TaskStatus,
  ) {
    if (user && status) {
      const newTask = await this.taskRepository.add(user, title, desc, status);
      await this.taskRepository.addUserTask(newTask, forUser);
      await this.taskStatusHistoryRepository.add(newTask, user, status, status);
      return newTask;
    } else {
      throw new HttpException("Can't Create", HttpStatusCode.BadRequest);
    }
  }

  private async createdOwnTask(createdForId: number | undefined) {
    return createdForId ? false : true;
  }

  public async deleteTask(userId: number, taskId: string) {
    const user = await this.userRepository.getOneById(userId);
    const task = await this.taskRepository.getOneById(Number(taskId));
    if (user && task && (await this.taskBelongsTo(user, task))) {
      await this.taskRepository.delete(Number(taskId));
    } else {
      throw new HttpException('Cant delete', HttpStatusCode.BadRequest);
    }
  }

  public async update(userId: number, object: UpdateTaskDto) {
    const user: User = await this.userRepository.getOneById(userId);
    const task: Task = await this.taskRepository.getOneById(object.id);
    const oldStatus: TaskStatus = task.status;
    let newStatus: TaskStatus | undefined = undefined;
    if (object.statusId) {
      newStatus = await this.taskStatusRepository.getOneById(object.statusId);
      delete object.statusId;
    }
    await this.updateTask(user, task, newStatus, oldStatus, object);
  }

  private async updateTask(
    user: User,
    task: Task,
    newStatus: TaskStatus,
    oldStatus: TaskStatus,
    updateObj: UpdateTaskDto,
  ) {
    if (await this.canUpdate(user, task)) {
      const props = {
        ...updateObj,
        status: newStatus ? newStatus : oldStatus,
        updatedBy: user,
        updatedAt: new Date(),
      };
      await this.taskRepository.updateT(props.id, props);
      await this.updateTaskStatusHistory(task, user, oldStatus, newStatus);
    } else {
      throw new HttpException('Cant update', HttpStatusCode.BadRequest);
    }
  }

  private async canUpdate(user: User, task: Task) {
    return user && task && (await this.taskBelongsTo(user, task));
  }

  private async updateTaskStatusHistory(
    task: Task,
    user: User,
    oldStatus: TaskStatus,
    newStatus: TaskStatus,
  ) {
    console.log(newStatus, oldStatus);
    if (newStatus && newStatus != oldStatus) {
      console.log('history updated', oldStatus, newStatus);
      await this.taskStatusHistoryRepository.add(
        task,
        user,
        oldStatus,
        newStatus,
      );
    }
  }

  private async createReturnTaskList(taskList: UserTaskMapping[]) {
    let returnTaskList: ITaskInfo[] = [];
    taskList.forEach((task) => {
      if (task.task.isActive === true) {
        let newTask: ITaskInfo = {
          id: task.task.id,
          title: task.task.title,
          desc: task.task.desc,
          status: task.task.status.status,
        };
        returnTaskList.push(newTask);
      }
    });
    return returnTaskList;
  }

  private async taskBelongsTo(user: User, task: Task) {
    const userTasks = await this.taskRepository.getUserTasks(user);
    for (let element of userTasks) {
      if (element.task.id === task.id) {
        return true;
      }
    }
    return false;
  }
}
