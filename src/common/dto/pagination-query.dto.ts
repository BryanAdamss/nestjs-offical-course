import { IsOptional, IsPositive } from 'class-validator';

export class PaginationQueryDto {
  @IsOptional() // 可选
  @IsPositive() // >0
  // @Type(() => Number) // 确保从query解析后为Number,也可开启ValidationPipe的enableImplicitConversion，自动根据声明类型转换
  limit: number;

  @IsOptional()
  @IsPositive()
  // @Type(() => Number)
  offset: number;
}
