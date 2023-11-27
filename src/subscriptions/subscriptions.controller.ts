import { Body, Controller, Get, Post, Req,UseGuards } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { JwtAuthGuard } from 'src/middleware/jwt.guard';
// import { CreateSubscriptionDto } from './dto/subs.dto';

@Controller('subscriptions')
@UseGuards(JwtAuthGuard)
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Post('create')
  async createSubscription( @Req() req) {
    const userId = req.user;

    try {
      const subscription = await this.subscriptionsService.createSubscription(userId);

      return { 
        message: "Conratulations! You are now a subscribed member" 
      };

    } catch (error) {
      return { error: error.message };
    }
  }

  @Get('status')
  async getSubscriptionStatus(@Req() req) {
    const userId = req.user; 

    try {
      const userSubscription = await this.subscriptionsService.getUserSubscription(userId);

      return { subscription: userSubscription };
    } catch (error) {
      return { error: error.message };
    }
  }
}
