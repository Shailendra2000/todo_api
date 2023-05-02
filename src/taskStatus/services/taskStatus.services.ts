import { Injectable } from "@nestjs/common";
import { TaskStatusRepository } from "../../task/repositories/task-status.repository";
import { TaskStatus } from "../../task/entities";
import { UserRepository } from "../../auth/repositories";
import { User } from "../../auth/entities";

@Injectable()
export class TaskStatusService{
    constructor(private taskStatusRepository : TaskStatusRepository, private userRepository : UserRepository){}
    public async getAll(){
        const statusList = await this.taskStatusRepository.getAll() 
        return this.sortStatusList(statusList)  
    }

    public async update(id:number,statusId:number,priority:number){
        const user = await this.userRepository.getOneById(id)
        return this.taskStatusRepository.updatePriority(statusId,user,priority)
    }
    public async add(userId:number,title:string){
        const user = await this.userRepository.getOneById(userId)
        const task = await  this.taskStatusRepository.add(user,title)
        return {createdStatus:{"id":task.id,"status":task.status,"Priority":task.Priority}}
    }

    public async remove(userId:number,statusId:number){
        const user = await this.userRepository.getOneById(userId)
        return await  this.taskStatusRepository.remove(statusId,user)
    }

    private sortStatusList (list:TaskStatus[]) {
        return list.sort((a, b) => {
            if (a.Priority < b.Priority) {
              return -1;
            }
            if (a.Priority > b.Priority) {
              return 1;
            }
            return 0;
          })
    }
}