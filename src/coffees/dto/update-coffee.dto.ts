import { PartialType } from '@nestjs/swagger';
import { CreateCoffeeDto } from './create-coffee.dto';

/**
 * 使用PartialType将继承CreateCoffeeDto的属性和所有验证pipe
 * 并将属性转为可选(通过动态添加@IsOptional()实现)
 */
export class UpdateCoffeeDto extends PartialType(CreateCoffeeDto) {}
