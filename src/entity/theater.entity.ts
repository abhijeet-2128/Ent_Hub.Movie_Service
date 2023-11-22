import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Theater extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  address: string;

  @Prop([
    {
      movie_id: { type: String, ref: 'Movies' },
      showtime: Date,
    },
  ])
  movie_showtimes: Array<{ movie_id: string; showtime: Date }>;

  @Prop({ type: Number, default: 0 })
  average_rating: number;
}

export const TheaterSchema = SchemaFactory.createForClass(Theater);
