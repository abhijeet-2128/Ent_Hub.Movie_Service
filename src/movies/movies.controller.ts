import { BadRequestException, Body, Controller, Get, Param, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MoviesSearchDto, ReviewDto } from 'src/dto/moviesearch.dto';
import { UserPreferenceReq } from 'src/proto/user/user';
import { JwtAuthGuard } from 'src/middleware/jwt.guard';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) { }

  @Get('')
  async getAllMovies(
    @Query('limit') limit: number,
    @Query('skip') skip: number,
  ) {
    return this.moviesService.getAllMovies(skip, limit);
  }


  @Get('movie/:movieId')
  getMovieDetails(@Param('movieId') movieId: string) {
    return this.moviesService.getMovieDetails(movieId);
  }


  //search
  @Get('search')
  searchMovies(@Query() criteria: MoviesSearchDto) {
    return this.moviesService.searchMovies(criteria);
  }  


  @Get('recommendations')
  getMovieRecommendations(@Query('userId') userId:string) {
  return this.moviesService.getMovieRecommendations(userId);
  }

  @Post('bookings')
  @UseGuards(JwtAuthGuard)
  async makeBooking(
    @Query('movieId') movieId: string,
    @Query('theaterId') theaterId: string,
    @Query('showtime') showtime: string,
    @Query('numberOfTickets') numberOfTickets: number,
    @Req() req
  ) {
    try {
      const userId = req.user;
      const booking = await this.moviesService.makeBooking(userId,movieId, theaterId, showtime, numberOfTickets,);
      return { message: 'Booking successful', booking };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      } else {
        throw new BadRequestException('Error making booking');
      }
    }
  }


  @Post('reviews/:movieId')
  @UseGuards(JwtAuthGuard)
  async submitMovieReview(
    @Param('movieId') movieId: string,
    @Body() review: ReviewDto, 
    @Req() req
  ) {
    try {
      const userId = req.user;
      const submittedReview = await this.moviesService.submitMovieReview(userId,movieId, review);
      return { message: 'Review submitted successfully', review: submittedReview };
    } catch (error) {
      throw new BadRequestException('Error submitting review');
    }
  }

  //get movie reviews
  @Get('reviews/:movieId')
  async getMovieReviews(@Param('movieId') movieId: string) {
    try {
      const reviews = await this.moviesService.getMovieReviews(movieId);
      return { reviews };
    } catch (error) {
      throw new BadRequestException('Error retrieving reviews');
    }
  }
  
// discouunts
// @Get('discounts/:movieId')
// async getMovie(@Param('movieId') movieId: string, @Req() req) {
//   const userId = req.user.id; // Extract user ID from the authenticated user
//   try {
//     const movieWithDiscount = await this.moviesService.getMovieWithDiscount(movieId, userId);
//     return { movieWithDiscount };
//   } catch (error) {
//     return { error: error.message };
//   }
// }


}

