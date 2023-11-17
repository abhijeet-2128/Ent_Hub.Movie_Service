import { Inject,Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import {  TokenResponse, USER_SERVICE_NAME, UserPreferenceReq, UserPreferenceRes, UserServiceClient } from '../proto/user/user';


@Injectable()
export class AuthService {
    private svc: UserServiceClient;  

    @Inject(USER_SERVICE_NAME)
    private readonly client: ClientGrpc;

    public onModuleInit():void {
        this.svc = this.client.getService<UserServiceClient>(USER_SERVICE_NAME);
    }

    public async validate(token: string): Promise<TokenResponse> {
      return firstValueFrom( this.svc.validate({ token }));
    }
    
      public async getUserPreferences(userId: string): Promise<UserPreferenceRes> {
        return firstValueFrom( this.svc.getUserPreferences({userId}));
      }
    
}