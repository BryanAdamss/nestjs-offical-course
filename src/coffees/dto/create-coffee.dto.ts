import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCoffeeDto {
  @ApiProperty({ description: '咖啡名称' })
  @IsString()
  readonly name: string;

  @ApiProperty({ description: '品牌' })
  @IsString()
  readonly brand: string;

  @ApiProperty({ description: '口味' })
  @IsString({ /** each 表示每个元素都是string*/ each: true })
  readonly flavors: string[];
}
