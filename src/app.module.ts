import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MoviesModule } from './movies/movies.module';
import { MongooseModule } from '@nestjs/mongoose';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
// import { SubscriptionController } from './subscription/subscription.controller';

@Module({
  imports: [
    MongooseModule.forRoot("mongodb+srv://abhijeetsrivastava:abhijeet2128@cluster0.8uv9xly.mongodb.net/sample_mflix"),
    // MongooseModule.forRoot('mongodb://localhost:27017/sample_mflix'),
    MoviesModule,
    SubscriptionsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
