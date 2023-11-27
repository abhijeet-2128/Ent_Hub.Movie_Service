import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TokenResponse } from 'src/proto/user/user';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly service: AuthService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> | never {
    const req: any = ctx.switchToHttp().getRequest();
    const authorization: string = req.headers['authorization'];
    if (!authorization) {
      throw new UnauthorizedException();
    }
    const bearer: string[] = authorization.split(' ');

    if (!bearer || bearer.length < 2) {
      throw new UnauthorizedException();
    }

    const token: string = bearer[1];

    const { isValid, userId }: TokenResponse = await this.service.validate(token);
    // console.log(`Decoded userId: ${userId}`);
    req.user = userId;
    

    if (!isValid) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
