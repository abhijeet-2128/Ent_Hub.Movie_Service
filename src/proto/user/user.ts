/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "user";

export interface TokenRequest {
  token: string;
}

export interface TokenResponse {
  isValid: boolean;
  userId: string;
}

export interface UserPreferenceReq {
  userId: string;
}

export interface UserPreferenceRes {
  viewingHabits: string[];
}

export const USER_PACKAGE_NAME = "user";

export interface UserServiceClient {
  validate(request: TokenRequest): Observable<TokenResponse>;

  getUserPreferences(request: UserPreferenceReq): Observable<UserPreferenceRes>;
}

export interface UserServiceController {
  validate(request: TokenRequest): Promise<TokenResponse> | Observable<TokenResponse> | TokenResponse;

  getUserPreferences(
    request: UserPreferenceReq,
  ): Promise<UserPreferenceRes> | Observable<UserPreferenceRes> | UserPreferenceRes;
}

export function UserServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["validate", "getUserPreferences"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("UserService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("UserService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const USER_SERVICE_NAME = "UserService";
