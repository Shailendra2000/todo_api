import { Role,User,UserRoleMapping } from "../entities";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from "@nestjs/common";
import { Task, UserTaskMapping } from "src/task/entities";

@Injectable()
export class UserRepository{    
    constructor( 
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(UserRoleMapping)
        private readonly userRoleMapRepository: Repository<UserRoleMapping>
    ){}
    
    public getOneByEmail=async(userEmail:string)=>{
        return await this.userRepository.findOneBy({email:userEmail})
    }
    
    public getOneById=async(id:number)=>{
        return await this.userRepository.findOneBy({id:id})
    }
    
    public add=async(username:string,email:string,hashedPassword:string,accessToken:string)=>{
        const newUser=this.userRepository.create()
        newUser.email=email
        newUser.isActive=true
        newUser.password=hashedPassword
        newUser.name=username
        newUser.accessToken=accessToken
        await this.userRepository.save(newUser)
        return {'message':'sucess'}
    }
    
    public updateToken=async(user:User,token:string)=>{
        await this.userRepository.update({id:user.id},{accessToken:token})
        
    }
    
    public getPassword=async(email:string)=>{
        const user=await this.userRepository.findOneBy({email:email})  
        if (user){
            return user.password
        }
        else{
            return 'Invalid Email'
        }
    }

    public getRole=async(user:User)=>{
        return await this.userRoleMapRepository.find({where:{user:user},relations:{role:true}})
    }

    public getByRole=async(role:Role)=>{
        return await this.userRoleMapRepository.find({relations:{user:true,role:true},where:{role:role}})
    }

    public addRole=async(user:User,role:Role)=>{
        const newUserRoleMapping = this.userRoleMapRepository.create()
        newUserRoleMapping.role=role
        newUserRoleMapping.user=user
        await this.userRoleMapRepository.save(newUserRoleMapping)    
    }
}