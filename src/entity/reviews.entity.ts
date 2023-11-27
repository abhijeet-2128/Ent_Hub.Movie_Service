import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Review extends Document {
  @Prop({ type: String, ref: 'User', required: true })
  userId: string;

  @Prop({ type: String, ref: 'Movie', required: true })
  movieId: string;

  @Prop({ type: Number, required: true, min: 1, max: 5 })
  rating: number;

  @Prop({ type: String, required: true })
  feedback: string;
  
  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
