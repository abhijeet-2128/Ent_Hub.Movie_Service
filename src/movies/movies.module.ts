import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { MovieSchema } from 'src/entity/movie.entity';
import { AuthService } from 'src/middleware/auth.service';
import { USER_PACKAGE_NAME, USER_SERVICE_NAME } from 'src/proto/user/user';
import { ClientsModule, Transport } from '@nestjs/microservices';
// import { Booking, BookingSchema } from 'src/entity/booking';
import { TheaterSchema } from 'src/entity/theater.entity';
import { BookingSchema } from 'src/entity/booking.entity';
import { ReviewSchema } from 'src/entity/reviews.entity';


@Module({
  imports: [
    // MongooseModule.forRoot('mongodb+srv://abhijeetsrivastava:abhijeet2128@cluster0.ugunmmm.mongodb.net/sample_mflix'),
    MongooseModule.forRoot('mongodb://localhost:27017/nest_db'),
    MongooseModule.forFeature([ 
        {name: 'Movies', schema: MovieSchema},
        {name : 'Booking', schema : BookingSchema},
        {name : 'Theater', schema : TheaterSchema},
        {name : 'Review', schema : ReviewSchema},
    ]),
    ClientsModule.register([
      {
        name: USER_SERVICE_NAME,
        transport: Transport.GRPC,
        options: {
          url: '0.0.0.0:50051',
          package: USER_PACKAGE_NAME,
          protoPath: '/home/admin185/Desktop/kafka-imp/movie_service/src/proto/user/user.proto',
        },
      },
    ])
  ],
  controllers: [MoviesController],
  providers: [MoviesService,AuthService],
})
export class MoviesModule { }
