import { Module } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionsController } from './subscriptions.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SubscriptionSchema } from './entity/subscriptions';
import { AuthService } from 'src/middleware/auth.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { USER_PACKAGE_NAME, USER_SERVICE_NAME } from 'src/proto/user/user';

@Module({
  imports:[
    MongooseModule.forFeature([ 
      {name: 'Subscription', schema: SubscriptionSchema},
  ]),
  ClientsModule.register([
    {
      name: USER_SERVICE_NAME,
      transport: Transport.GRPC,
      options: {
        url: '0.0.0.0:50051',
        package: USER_PACKAGE_NAME,
        protoPath: '/home/admin185/Desktop/Ent_Hub_Project/movie_service/src/proto/user/user.proto',
      },
    },
  ])
  ],
  controllers: [SubscriptionsController],
  providers: [SubscriptionsService,AuthService],
})
export class SubscriptionsModule {}
