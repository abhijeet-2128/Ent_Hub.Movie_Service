import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Subscription } from './entity/subscriptions';
import { Model } from 'mongoose';

@Injectable()
export class SubscriptionsService {
  constructor(@InjectModel(Subscription.name) private subscriptionModel: Model<Subscription>) { }

  async createSubscription(userId: string): Promise<Subscription> {
    const startDate = Date.now();
   
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 15);

    const subscription = new this.subscriptionModel({ userId, startDate, endDate });
    return subscription.save();
  }

  async getUserSubscription(userId: string): Promise<Subscription | null> {
    return this.subscriptionModel.findOne({ userId, startDate: { $lte: new Date() }, endDate: { $gte: new Date() } }).exec();
  }
}
