import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
/** 模拟http请求 */
import * as request from 'supertest';
import { CoffeesModule } from '../../src/coffees/coffees.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateCoffeeDto } from 'src/coffees/dto/create-coffee.dto';

describe('[Feature] Coffees - /coffees', () => {
  const coffee = {
    name: 'my coffee',
    brand: 'brew',
    flavors: ['chocolate', 'vanilla'],
  };

  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        CoffeesModule,
        /** 连接e2e装用测试数据库 */
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5433,
          username: 'postgres',
          password: 'pass123',
          database: 'postgres',
          autoLoadEntities: true,
          synchronize: true,
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();

    /** 使用一样的global pipes */
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true, // dto中未声明的属性会被过滤掉
        forbidNonWhitelisted: true, // 出现dto中未声明的属性时，抛400 BadRequest错误
        transform: true, // 转换数据类型，可将query、paramas转换为声明的类型
        transformOptions: {
          enableImplicitConversion: true, // 开启隐式转换，自动将query上的string转为dto中指定类型，就可以不用在dto中使用@Type()
        },
      }),
    );

    await app.init();
  });

  it('Create [POST /]', () => {
    return (
      request(app.getHttpServer())
        /** 触发路由/coffees */
        .get('/coffees')
        .send(coffee as CreateCoffeeDto)
        /** 断言状态 */
        .expect(HttpStatus.CREATED)
        .then(({ body }) => {
          /** 用jasmine辅助断言返回值 */
          const expectedCoffee = jasmine.objectContaining({
            ...coffee,
            flavors: jasmine.arrayContaining(
              coffee.flavors.map((name) => jasmine.objectContaining({ name })),
            ),
          });

          expect(body).toEqual(expectedCoffee);
        })
    );
  });
  it.todo('Get all [GET /]');
  it.todo('Get one [GET /:id]');
  it.todo('Update one [PATCH /:id]');
  /** 用todo标记将要实现的测试 */
  it.todo('Delete one [DELETE /:id]');

  afterAll(async () => {
    app.close();
  });
});
