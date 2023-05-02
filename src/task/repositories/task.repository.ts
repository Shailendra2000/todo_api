import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/auth/entities";
import { Repository } from "typeorm";
import { Task, TaskStatus, UserTaskMapping } from "../entities";
import { UpdateTaskDto } from "../dto/task.dto";

export class TaskRepository{
    constructor(
        @InjectRepository(Task)
        private taskRepository : Repository<Task>,
        @InjectRepository(UserTaskMapping)
        private userTaskMapRepository : Repository<UserTaskMapping>
    ){
    }
    public add=async(user:User,title:string,desc:string,status:TaskStatus)=>{
        let date_ob = new Date();
        const newTask = this.taskRepository.create()
        newTask.title=title
        newTask.createdAt=date_ob
        newTask.createdBy=user
        newTask.desc=desc
        newTask.status=status
        newTask.isActive=true
        newTask.position=1
        return await this.taskRepository.save(newTask)
    }
    public delete = async(taskID:number)=>{
        await this.taskRepository.update({id:taskID},{isActive:false})
    }
    public getOneById = async (taskId:number)=>{
        return await this.taskRepository.findOneBy({id:taskId})
    }
    public update = async (taskId:number,title:string,desc:string,status:TaskStatus,user:User)=>{
        let date_ob = new Date(); 
        await this.taskRepository.update({id:taskId},{title:title,desc:desc,status:status,updatedBy:user,updatedAt:date_ob})  
    }
    public statusUpdate = async (taskID:number,status:TaskStatus,user:User) => {
        let date_ob = new Date(); 
        await this.taskRepository.update({id:taskID},{status:status,updatedBy:user,updatedAt:date_ob})
    }

    public positionUpdate = async (taskID:number,position:number) => {
        await this.taskRepository.update({id:taskID},{position:position})
    }

    public addUserTask=async(task:Task,user:User)=>{
        const newUserTaskMapping = this.userTaskMapRepository.create()
        newUserTaskMapping.task=task
        newUserTaskMapping.user=user
        await this.userTaskMapRepository.save(newUserTaskMapping)   
    }

    public getUserTasks=async(user:User)=>{
        return await this.userTaskMapRepository.find({where:{user:user},relations:{task:true,user:true}})
    }
    public getUserTasksByStatus=async(user:User,status:TaskStatus)=>{
        return await this.userTaskMapRepository.find({where:{user:user,task:{status:status}},relations:{task:true,user:true}})
    }
    public getUserTasksByStatusPagination=async(user:User,status:TaskStatus,page:number,limit:number)=>{
        const [tasks, total] = await this.userTaskMapRepository.findAndCount({
            skip: (page - 1) * limit,
            take: limit,
            where:{task:{status:status,isActive:true},user:user},
            relations:{task:true,user:true},
            order:{task:{position:'ASC'}}
          });
        return {tasks,total}
    }
    public updateT = async (taskId:number,props) => {
        return await this.taskRepository.update({id:taskId},{...props}) 
    } 
}