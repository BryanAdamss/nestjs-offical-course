import { Module } from '@nestjs/common';
import { CoffeesController } from './coffees.controller';
import { CoffeesService } from './coffees.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';

@Module({
  imports: [
    /** 让typeorm知道CoffeeModule子模块内有哪些实体 */
    TypeOrmModule.forFeature([Coffee, Flavor]),
  ],
  controllers: [CoffeesController],
  providers: [CoffeesService],
})
export class CoffeesModule {}
