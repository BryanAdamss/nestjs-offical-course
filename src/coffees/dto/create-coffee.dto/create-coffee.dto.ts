import { IsString } from 'class-validator';

export class CreateCoffeeDto {
  @IsString()
  readonly name: string;

  @IsString()
  readonly brand: string;

  @IsString({ /** each 表示每个元素都是string*/ each: true })
  readonly flavors: string[];
}
