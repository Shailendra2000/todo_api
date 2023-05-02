import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from "../../auth/repositories";
import { AdminGuard } from './admin.guard';


@Injectable()
export class RequestGuard implements CanActivate {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}
  public async canActivate(context: ExecutionContext) {
    try {
      const req = context.switchToHttp().getRequest();
      console.log(req.body,req.headers['authorization'])
      const payload = this.jwtService.verify(req.headers['authorization']);
      req['user'] = payload;
      if ( req.query.userId ){
        const admin = await new AdminGuard(this.userRepository).canActivate(context)
        return admin
      }
      return true;
    } catch (e) {
      throw new HttpException('Invalid Access Token', HttpStatus.UNAUTHORIZED);
    }
  }
}
