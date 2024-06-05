import { Test, TestingModule } from '@nestjs/testing';
import { CoffeesService } from './coffees.service';
import { Connection, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Flavor } from './entities/flavor.entity';
import { Coffee } from './entities/coffee.entity';
import { NotFoundException } from '@nestjs/common';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
/** 创建模拟的Repository */
const createMockRepository = <T = any>(): MockRepository<T> => ({
  findOne: jest.fn(),
  create: jest.fn(),
});

describe('CoffeesService', () => {
  let service: CoffeesService;
  let coffeeRepository: MockRepository;

  /** 在每次测试前执行，类似还有beforeEach,beforeAll,afterAll */
  beforeEach(async () => {
    /** createTestingModule的入参和@Module装饰器一致 */
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoffeesService,
        /** 将CoffeesService的依赖项，以mock形式提供 */
        { provide: Connection, useValue: {} },
        {
          provide: getRepositoryToken(Flavor),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(Coffee),
          useValue: createMockRepository(),
        },
      ],
    }) /** compile引导模块及依赖项，类似main.ts中NestFactory.create() */
      .compile();

    /**
     * 用get从TestingModule中获取要测试的实例
     * 如果要测试的provider是request-scoped或transient-scoped，则使用await module.resolve(CoffeesService)
     */
    service = module.get<CoffeesService>(CoffeesService);
    coffeeRepository = module.get<MockRepository>(getRepositoryToken(Coffee));
  });

  /** it为individual test */
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  /** 一般测试某方法时，使用describe并用方法名做为首个参数 */
  describe('findOne', () => {
    describe('when coffee with ID exists', () => {
      it('should return the coffee object', async () => {
        const coffeeId = 1;
        const expectedCoffee = {};

        /** 让repository模拟返回期望的coffee对象 */
        coffeeRepository.findOne.mockReturnValue(expectedCoffee);

        const coffee = await service.findOne(coffeeId);
        expect(coffee).toEqual(expectedCoffee);
      });
    });

    describe('otherwise', () => {
      it('should throw the "NotFoundException"', async () => {
        const coffeeId = 1;

        /** 让repository模拟返回 */
        coffeeRepository.findOne.mockReturnValue(undefined);
        try {
          await service.findOne(coffeeId);
        } catch (error) {
          expect(error).toBeInstanceOf(NotFoundException);
          expect(error.message).toEqual(`Coffee #${coffeeId} not found`);
        }
      });
    });
  });
});
