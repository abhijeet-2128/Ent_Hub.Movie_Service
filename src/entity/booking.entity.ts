import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum BookingStatus {
  Booked = 'Booked',
  Canceled = 'Canceled',
}

@Schema()
export class Booking extends Document {
  @Prop({ type: String, ref: 'User', required: true })
  user_id: string;

  @Prop({ type: String, ref: 'Movie',required: true })
  movie_id: string; 

  @Prop({ type: String, ref: 'Theater', required: true })
  theater_id: string;

  @Prop({ type: Date, required: true })
  showtime: Date;

  @Prop({ type: Date, default: Date.now })
  booking_Date: Date;

  @Prop({ type: Number, default: 1 })
  numberOfTickets : Number;
  
  @Prop({type :Number , required:true })
  totalAmount : Number

  @Prop({ type: String, enum: BookingStatus, default: BookingStatus.Booked })
  status: BookingStatus;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
