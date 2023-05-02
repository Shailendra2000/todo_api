import { Injectable } from "@nestjs/common/decorators/core/injectable.decorator";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { TaskStatus } from "../entities";
import { User } from "src/auth/entities";

@Injectable()
export class TaskStatusRepository{
    constructor(
        @InjectRepository(TaskStatus)
        private taskStatusRepository : Repository<TaskStatus>
    ){}
    public getOneById=async(id:number)=>{
        return await this.taskStatusRepository.findOneBy({id:id})
    }
    public getAll = async () => {
        return await 
        this.taskStatusRepository
        .createQueryBuilder('status')
        .select(["status.id", "status.status", "status.Priority"])
        .where({"isActive":"1"})
        .getMany();
    }
    public getOneByName=async(name:string)=>{
        return await this.taskStatusRepository.findOneBy({status:name})
    }
    public add = async(user:User,status:string)=>{
        const newStatus = this.taskStatusRepository.create()
        newStatus.createdAt= new Date()
        newStatus.createdBy=user
        newStatus.isActive=true
        newStatus.status=status
        return await this.taskStatusRepository.save(newStatus)
    }
    public remove = async(statusId:number,user:User) => {
        await this.taskStatusRepository.update({id:statusId},{isActive:false,updatedAt:new Date(),updatedBy:user})
    }
  
    public updatePriority=async(statusId:number,user:User,priority:number,)=>{
        await this.taskStatusRepository.update({id:statusId},{updatedAt:new Date(),updatedBy:user,Priority:priority})
    }
}