import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt/dist";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthController } from "./controllers/auth.controller";
import { Role, User, UserRoleMapping } from "./entities";
import { RoleRepository, UserRepository } from "./repositories";
import { AuthServices } from "./services";

@Module({
    imports:[
        TypeOrmModule.forFeature([User, UserRoleMapping, Role ]),
        JwtModule.register({global:true,secret:'Mysecret@1',signOptions:{expiresIn:'24h'}})
    ],
    controllers:[AuthController],
    providers:[AuthServices,UserRepository,RoleRepository],
    exports:[UserRepository,RoleRepository]
})

export class AuthModule {};