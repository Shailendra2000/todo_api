import { Body, Controller, Delete, Get, Post, Put, Query, Req, UseGuards } from "@nestjs/common";
import { TaskStatusService } from "../services/taskStatus.services";
import { RequestGuard } from "../../task/guards/request.guard";
import { AdminGuard } from "../../task/guards/admin.guard";
import { Request } from "express";

@Controller('task-status')
export class TaskStatusController{
    constructor( private taskStatusServices : TaskStatusService ){}
    @Get()
    @UseGuards(RequestGuard)
    async get(){
        return await this.taskStatusServices.getAll();
    }
    @Put()
    @UseGuards(RequestGuard,AdminGuard)
    async update(@Req() req:Request, @Body('statusId') statusId:number, @Body('priority') priority:number){
        const user = req['user']
        return await this.taskStatusServices.update(user.id,statusId,priority);
    }
    @Delete()
    @UseGuards(RequestGuard,AdminGuard)
    async remove(@Req() req:Request,@Query('statusId') statusId:number){
        const user = req['user']
        console.log(statusId)
        return await this.taskStatusServices.remove(user.id,Number(statusId));
    }

    @Post()
    @UseGuards(RequestGuard,AdminGuard)
    async add(@Req() req:Request,@Body('title') title:string){
        const user = req['user']
        return await this.taskStatusServices.add(user.id,title)
    }
}