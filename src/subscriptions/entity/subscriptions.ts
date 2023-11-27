import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Subscription {
  @Prop()
  userId: string;

  @Prop()
  startDate: Date;

  @Prop()
  endDate: Date;

  @Prop({type :Number, default:0})
  discountPercentage : Number
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);
