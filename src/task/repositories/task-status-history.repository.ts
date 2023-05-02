import { Injectable } from "@nestjs/common/decorators/core/injectable.decorator";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/auth/entities";
import { Repository } from "typeorm";
import { Task, TaskStatus, TaskStatusHistory } from "../entities";

@Injectable()
export class TaskStatusHistoryRepository{
    constructor(
        @InjectRepository(TaskStatusHistory)
        private taskStatusRepository : Repository<TaskStatusHistory>
    ){}
    public add=async(task:Task,user:User,from_status:TaskStatus,to_status:TaskStatus)=>{
        const newUserTaskHsitory = this.taskStatusRepository.create()
        newUserTaskHsitory.task=task
        newUserTaskHsitory.user=user
        newUserTaskHsitory.fromStatus=from_status
        newUserTaskHsitory.toStatus=to_status;
        await this.taskStatusRepository.save(newUserTaskHsitory)   
    }

}