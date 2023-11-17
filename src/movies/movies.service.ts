import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Movies } from 'src/entity/movie.entity';
import { ObjectId } from 'mongodb';
import { MoviesSearchDto, ReviewDto } from '../dto/moviesearch.dto'
import { UserPreferenceRes } from 'src/proto/user/user';
import { AuthService } from 'src/middleware/auth.service';
import { Theater } from 'src/entity/theater.entity';
import { Booking, BookingStatus } from 'src/entity/booking.entity';
import { Review } from 'src/entity/reviews.entity';


@Injectable()
export class MoviesService {
  constructor(@InjectModel(Movies.name) private movieModel: Model<Movies>,
  @InjectModel(Booking.name) private bookingModel: Model<Booking>,
  @InjectModel(Theater.name) private theaterModel: Model<Theater>,
  @InjectModel(Review.name) private reviewModel: Model<Review>,
    private readonly service: AuthService,
  ) { }

  async getAllMovies(skip = 0,
    limit = 8,) {
    const count = await this.movieModel.countDocuments({});
    const pageTotal = Math.floor((count - 1) / limit) + 1;
    const data = await this.movieModel.find().limit(limit).skip(skip).exec();
    return {
      data: data,
      page_total: pageTotal,
      status: 200,
    }
  }


  async getMovieDetails(movieId: string) {

    if (!Types.ObjectId.isValid(movieId)) {
      throw new NotFoundException('Invalid movieId');
    }
    const pipeline = [
      {
        $match: {
          _id: new ObjectId(movieId)
        }
      },
      {
        $lookup: {
          from: "theaters",
          let: { movieId: "$_id" },
          pipeline: [
            {
              $unwind: "$movie_showtimes"
            },
            {
              $match: {
                $expr: {
                  $eq: [{ $toObjectId: "$movie_showtimes.movie_id" }, "$$movieId"]
                }
              }
            },
            {
              $project: {
                _id: 1,
                name: 1,
                address: 1,
                showtime: "$movie_showtimes.showtime",
                average_rating: 1
              }
            }
          ],
          as: "theaters"
        }
      }
    ]

    const movieDetails = await this.movieModel.aggregate(pipeline);
    return movieDetails;
  }


  async searchMovies(criteria: MoviesSearchDto): Promise<Movies[]> {
    console.log("----------------");

    const { title, genre, release_date } = criteria;
    if (!title && !genre && !release_date) {
      throw new BadRequestException('At least one of title, genre, or release_date is required.');
    }
    const query: any = {};

    if (title) {
      query.title = title;
    }

    if (genre) {
      query.genre = genre;
    }

    if (release_date) {
      query.release_date = release_date;
    }
    return this.movieModel.find(query).exec();
  }



  async getMovieRecommendations(userId: string) {
    const userPreferences: UserPreferenceRes = await this.service.getUserPreferences(userId);
    const recommendedMovies = await this.movieModel
      .find({ genre: { $in: userPreferences.viewingHabits } })
      .limit(5)
      .exec();

    return recommendedMovies;
  }


  async makeBooking(user_id : string,movieId: string, theaterId: string, showtime: string, numberOfTickets: number): Promise<Booking> {
    const movie = await this.movieModel.findById(movieId).exec();
    if (!movie) {
      throw new BadRequestException('Movie not found');
    }

    // Check if the theater exists
    const theater = await this.theaterModel.findById(theaterId).exec();

    if (!theater) {
      throw new BadRequestException('Theater not found');
    }
  
    const booking = new this.bookingModel({
      user_id: user_id,
      movie_id: movieId,
      theater_id: theaterId,
      showtime : showtime,
      booking_Date: new Date(),
      numberOfTickets:numberOfTickets,
      status: BookingStatus.Booked,
    });

    return booking.save();
  }

  async submitMovieReview(userId : string,movieId: string, reviewDto: ReviewDto): Promise<Review> {
    const newReview = new this.reviewModel({
      userId,
      movieId,
      rating: reviewDto.rating,
      feedback: reviewDto.feedback,
    });
    return newReview.save();
  }


  async getMovieReviews(movieId: string): Promise<Review[]> {
    const movie = await this.movieModel.findById(movieId);
    if (!movie) {
      throw new BadRequestException('Movie not found');
    }
    const reviews = await this.reviewModel.find({ movieId: movieId });
    return reviews;
  }
}
