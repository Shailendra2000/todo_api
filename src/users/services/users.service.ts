import { Injectable } from "@nestjs/common";
import { UserRoleMapping } from "../../auth/entities";
import { RoleRepository, UserRepository } from "../../auth/repositories";
import { IUserIdentity } from "../interfaces/user-identity.interface";

@Injectable()
export class UsersService{
    defaultUserRoleId:number
    constructor(private userRepository : UserRepository , private roleRepository : RoleRepository ){ this.defaultUserRoleId = 2 }
    public getUserList=async(roleId:number=this.defaultUserRoleId)=>{
        const role = await this.roleRepository.getOneById(roleId)
        if ( role ){
            const userList = await this.userRepository.getByRole(role)
            return this.prepareUserData(userList)
        }
        else{
            return []
        }
    }
    public prepareUserData = (userList:UserRoleMapping[])=>{
        let returnObject:IUserIdentity[]=[];
        userList.forEach(element => {
            let user:IUserIdentity={'id':element.user.id,'email':element.user.email,'name':element.user.name}
            returnObject.push(user)
        });
        return returnObject
    }
}