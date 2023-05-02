import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { Role, User } from "../entities"

@Injectable()
export class RoleRepository{
    constructor(
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>
        ){}

    public getOneById=async(roleId:number)=>{
        return await this.roleRepository.findOneBy({id:roleId})
    }
}