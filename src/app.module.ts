import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MoviesModule } from './movies/movies.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    // MongooseModule.forRoot('mongodb+srv://abhijeetsrivastava:abhijeet2128@cluster0.6mk5ny2.mongodb.net/sample_mflix'),
    MongooseModule.forRoot('mongodb://localhost:27017/sample_mflix'),
    MoviesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
