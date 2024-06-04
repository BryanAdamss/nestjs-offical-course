import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { WrapResponseInterceptor } from './common/interceptors/wrap-response.interceptor';
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// import { ApiKeyGuard } from './common/guards/api-key.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  /** 使用全局ValidationPipe */
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
  app.useGlobalInterceptors(
    new WrapResponseInterceptor(),
    new TimeoutInterceptor(),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  // 在common.module中创建了ApiKeyGuard
  // app.useGlobalGuards(new ApiKeyGuard());

  /** 集成swagger */
  const options = new DocumentBuilder()
    .setTitle('Iluvcoffee')
    .setDescription('Coffee app')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  /** 指定访问路由为/api，默认port是app的服务端口3000，所以通过localhost:3000/api即可访问swagger */
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
