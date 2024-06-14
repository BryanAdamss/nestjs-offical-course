import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/**
 * Schema 将Coffee类映射为同名小写+s结尾的MongoDB集合，这里映射coffees集合
 */
@Schema()
export class Coffee extends Document {
  @Prop()
  name: string;

  @Prop()
  brand: string;

  @Prop([String])
  flavors: string[];
}

export const CoffeeSchema = SchemaFactory.createForClass(Coffee);
