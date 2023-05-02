import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt'
import validator from 'validator'
import { Role, User, UserRoleMapping } from '../entities';
import { RoleRepository,UserRepository } from '../repositories';
@Injectable()
export class AuthServices{
    private defaultUserRoleId:number;
    private adminRoleId:number

    constructor(private jwtService:JwtService,private userRepository:UserRepository, private roleRepository:RoleRepository){
        this.defaultUserRoleId = 2
        this.adminRoleId = 1
    }
    public async signUp (username:string,email:string,password:string){
        if (!validator.isEmail(email)){
            return { 'message':'invalid email' }
        }
        const hashedPassword: string = await this.hashPassword(password)
        const accessToken = this.jwtService.sign({'email':email})
        const response = await this.userRepository.add(username,email,hashedPassword,accessToken)
        if (response.message=='sucess'){
            await this.userRoleEntry(email)
        }
        return response
    }

    public async signIn(email:string){
        const user =await this.userRepository.getOneByEmail(email) as User
        const accessToken=await this.jwtService.signAsync({'id':user.id,'email':user.email})
        await this.userRepository.updateToken(user,accessToken)
        const isAdmin = await this.checkAdmin(email,this.adminRoleId)
        return { 'message' : 'Sucess', 'token':`${accessToken}`, 'isAdmin':isAdmin}
    }

    private async userRoleEntry(email:string){
        const user = await this.userRepository.getOneByEmail(email) as User
        const role = await this.roleRepository.getOneById(this.defaultUserRoleId) as Role
        await this.userRepository.addRole(user,role)
    }

    private async hashPassword(password:string){
        const saltRounds: number = 12;
        const salt: string = await bcrypt.genSalt(saltRounds);
        return await bcrypt.hash(password, salt);
    }
    private async checkAdmin(userEmail:string,adminId:number){
        const user = await this.userRepository.getOneByEmail(userEmail)
        const roles = await this.userRepository.getRole(user)
        console.log(roles)
        for(const role of roles){
            console.log(role.id,adminId)
            if (role.id === adminId){
                return true
            }
        }
        return false
    }
}
