import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Coffee } from './entities/coffee.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { Flavor } from './entities/flavor.entity';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { Event } from '../events/entities/event.entity';
import {
  COFFEE_BRANDS,
  COFFEE_BRANDS_ASYNC,
  COFFEE_BRANDS_WITH_FACTORY,
} from './coffees.constants';
import { ConfigService } from '@nestjs/config';

@Injectable() /** Injectable标记此类是一个可被IoC容器管理的可注入类 */
export class CoffeesService {
  constructor(
    /** 注入Coffee实体的repository */
    @InjectRepository(Coffee)
    private readonly coffeeRepository: Repository<Coffee>,
    @InjectRepository(Flavor)
    private readonly flavorRepository: Repository<Flavor>,
    private readonly connection: Connection,
    @Inject(COFFEE_BRANDS) coffeeBrands: string[],
    @Inject(COFFEE_BRANDS_WITH_FACTORY) coffeeBransWithFactory: string[],
    @Inject(COFFEE_BRANDS_ASYNC) coffeeBransAsync: string[],
    private readonly configService: ConfigService,
  ) {
    console.log('coffeeBrands :>> ', coffeeBrands);
    console.log('coffeeBransWithFactory :>> ', coffeeBransWithFactory);
    console.log('coffeeBransAsync :>> ', coffeeBransAsync);

    const databaseHost = this.configService.get<string>(
      'DATABASE_HOST',
      /** 默认值 */
      'default_host',
    );
    console.log(
      `this.configService.get<string>('DATABASE_HOST');`,
      databaseHost,
    );

    /** 使用点语法加载自定义配置 */
    const customDatabaseHost = this.configService.get('database.port');
    console.log('customDatabaseHost :>> ', customDatabaseHost);
  }

  findAll(paginationQuery: PaginationQueryDto) {
    const { limit, offset } = paginationQuery;
    return this.coffeeRepository.find({
      /** 返回关联的flavors */
      relations: ['flavors'],
      /** 利用find自带的skip和take接收分页参数 */
      skip: offset,
      take: limit,
    });
  }

  async findOne(id: number) {
    const coffee = await this.coffeeRepository.findOne({
      where: { id },
      /** 返回关联的flavors */
      relations: ['flavors'],
    });
    if (!coffee) {
      throw new NotFoundException(`Coffee #${id} not found`);
    }
    return coffee;
  }

  async create(createCoffeeDto: CreateCoffeeDto) {
    const flavors = await Promise.all(
      createCoffeeDto.flavors.map((name) => this.preloadFlavorByName(name)),
    );

    const coffee = this.coffeeRepository.create({
      ...createCoffeeDto,
      flavors,
    });
    return this.coffeeRepository.save(coffee);
  }

  async update(id: number, updateCoffeeDto: UpdateCoffeeDto) {
    const flavors =
      updateCoffeeDto.flavors &&
      (await Promise.all(
        updateCoffeeDto.flavors.map((name) => this.preloadFlavorByName(name)),
      ));

    /**
     * preload根据传入的对象创建一个新实体
     * 如果实体存在，用传入的值替换实体值
     * 找不到，返回undefined
     */
    const coffee = await this.coffeeRepository.preload({
      id,
      ...updateCoffeeDto,
      flavors,
    });

    if (!coffee) {
      throw new NotFoundException(`Coffee #${id} not found`);
    }

    return this.coffeeRepository.save(coffee);
  }

  async remove(id: number) {
    const coffee = await this.findOne(id);

    return this.coffeeRepository.remove(coffee);
  }

  async recommendCoffee(coffee: Coffee) {
    const queryRunner = this.connection.createQueryRunner();

    /** 连接数据库 */
    await queryRunner.connect();
    /** 开始事务 */
    await queryRunner.startTransaction();
    /**
     * 将事务操作包裹在try...cache...finally中
     * try中commitTransaction
     * cache中回滚rollbackTransaction
     * finally中释放release
     */
    try {
      coffee.recommendations++;
      const recommendEvent = new Event();
      recommendEvent.name = 'recommend_coffee';
      recommendEvent.type = 'coffee';
      recommendEvent.payload = { coffeeId: coffee.id };

      await queryRunner.manager.save(coffee);
      await queryRunner.manager.save(recommendEvent);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  private async preloadFlavorByName(name: string): Promise<Flavor> {
    const existingFlavor = await this.flavorRepository.findOne({
      where: { name },
    });

    if (existingFlavor) return existingFlavor;

    return this.flavorRepository.create({ name });
  }
}
