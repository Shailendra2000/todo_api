import { Injectable } from "@nestjs/common";
import { UserRepository } from "./auth/repositories";

@Injectable()
export class AppServices{
    constructor(private userRepository : UserRepository){}
    public checkAdmin=async(userId:number,roleId:number)=>{
        const user = await this.userRepository.getOneById(userId)
        const userRoles= await this.userRepository.getRole(user)
        for(let role of userRoles){
            if (role.role.id===roleId){
                return true
            }
        }
        return false
    }
}