import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { User } from "../../auth/entities";
import { UserRepository } from "../../auth/repositories";

@Injectable()
export class AdminGuard implements CanActivate{
    private adminRoleId
    constructor(private userRepository : UserRepository){ this.adminRoleId = 1 }
    public async canActivate(context:ExecutionContext){
        try{
            const req = context.switchToHttp().getRequest()
            const userId = req['user'].id
            const user = await this.userRepository.getOneById(userId)
            if (await this.checkRights(user,this.adminRoleId)){
                return true
            }
        }
        catch(e){
            console.log(e)
            throw new HttpException('Invalid Admin Access Token',HttpStatus.UNAUTHORIZED)
        }
    }
    private checkRights=async(user:User,roleId:number)=>{
        const userRoles= await this.userRepository.getRole(user)
        for(let role of userRoles){
            if (role.role.id==roleId){
                return true
            }
        }
        return false
    }
}