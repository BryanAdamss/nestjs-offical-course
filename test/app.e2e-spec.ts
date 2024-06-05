import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
/** 模拟http请求 */
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  /** 由于app在e2e测试中仅需要初始化1次，所以用beforeAll而不是beforeEach */
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return (
      request(app.getHttpServer())
        /** 触发路由/ */
        .get('/')
        .set('Authorization', process.env.API_KEY)
        .expect(200)
        .expect('Hello World!')
    );
  });

  /** 避免app未正常关闭，出现Jest dit not exit one second after the test run has completed  */
  afterAll(async () => {
    app.close();
  });
});
