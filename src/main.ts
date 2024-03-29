import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  /** 使用全局ValidationPipe */
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // dto中未声明的属性会被过滤掉
      forbidNonWhitelisted: true, // 出现dto中未声明的属性时，抛400 BadRequest错误
      transform: true, // 转换数据类型，可将query、paramas转换为声明的类型
    }),
  );
  await app.listen(3000);
}
bootstrap();
