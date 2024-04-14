import { Injectable, Module } from '@nestjs/common';
import { CoffeesController } from './coffees.controller';
import { CoffeesService } from './coffees.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';
import { Event } from '../events/entities/event.entity';
import {
  COFFEE_BRANDS,
  COFFEE_BRANDS_ASYNC,
  COFFEE_BRANDS_WITH_FACTORY,
} from './coffees.constants';
import { Connection } from 'typeorm';
import { ConfigModule } from '@nestjs/config';

class ConfigService {}
class DevelopmentConfigService {}
class ProductionConfigService {}

@Injectable()
export class CoffeeBrandsFactory {
  create() {
    // do sth
    return ['buddy brew', 'factory'];
  }
}

@Module({
  imports: [
    /** 让typeorm知道CoffeeModule子模块内有哪些实体 */
    TypeOrmModule.forFeature([Coffee, Flavor, Event]),
    ConfigModule,
  ],
  controllers: [CoffeesController],
  providers: [
    CoffeesService,
    {
      provide: COFFEE_BRANDS,
      useValue: ['brands1'],
    },
    CoffeeBrandsFactory,
    {
      provide: COFFEE_BRANDS_WITH_FACTORY,
      inject: [CoffeeBrandsFactory],
      useFactory: (brandsFactory: CoffeeBrandsFactory) =>
        brandsFactory.create(),
    },

    {
      provide: COFFEE_BRANDS_ASYNC,
      inject: [Connection],
      useFactory: async (connection: Connection): Promise<string[]> => {
        console.log('connection :>> ', connection.driver.treeSupport);
        console.log('async factory');
        const coffeeBrands = await Promise.resolve(['coffee brands async']);
        return coffeeBrands;
      },
    },
    {
      provide: ConfigService,
      useClass:
        process.env.NODE_ENV === 'development'
          ? DevelopmentConfigService
          : ProductionConfigService,
    },
  ],
  exports: [CoffeesService],
})
export class CoffeesModule {}
