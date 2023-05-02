import { Controller, Get, Redirect, Req, UseGuards } from "@nestjs/common";
import { AppServices } from "./app.service";
import { RequestGuard } from "./task/guards/request.guard";

@Controller()
export class AppController{
    private userUrl:string
    private taskUrl:string

    constructor(private appService : AppServices){
          this.userUrl = 'http://localhost:9000/users'
          this.taskUrl = 'http://localhost:9000/task'
    }
    
    @Get()
    @UseGuards(RequestGuard)
    @Redirect()
    async get(@Req() request: Request){
        const isAdmin = await this.appService.checkAdmin(request['user'].id,1)
        console.log(request['user'])
        if(isAdmin){
            return { url: this.userUrl };
        }
        else{
            return { url:  this.taskUrl};
        }
    }
}
