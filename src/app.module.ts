import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoffeesModule } from './coffees/coffees.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoffeeRatingModule } from './coffee-rating/coffee-rating.module';
import { DynamicExampleModule } from './dynamic-example/dynamic-example.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CommonModule } from './common/common.module';
import * as Joi from 'joi';
import appConfig from './config/app.config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  /**
   * 声明此模块的依赖模块
   * 依赖模块中exports出来的依赖可直接注入使用
   * 不用在providers中声明
   */
  imports: [
    /** 使用异步方法，规避加载顺序问题 */
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DATABASE_HOST'),
        port: configService.get('DATABASE_PORT'),
        username: configService.get('DATABASE_USER'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        /** 自动加载模块 */
        autoLoadEntities: true,
        /** 同步数据，确保typeorm实体在每次运行应用程序时都与数据库同步，生产禁用 */
        synchronize: true,
      }),
    }),
    /** 默认从根目录查找.env文件 */
    ConfigModule.forRoot({
      /** 同名key，前面覆盖后面 */
      // envFilePath: ['.env', '.env.local', '.env.production'],
      /** 不用.env配置时，可设置为true */
      // ignoreEnvFile:true
      /** 默认情况下，所有config的key都是optional，可通过joi设置为required */
      validationSchema: Joi.object({
        DATABASE_HOST: Joi.required(),
        DATABASE_PORT: Joi.number().default(5432),
      }),
      /** 加载自定义配置 */
      load: [appConfig],
    }),
    CoffeesModule,
    /** typeorm连接数据库配置 */

    CoffeeRatingModule,
    /** 调用动态模块的静态方法实现注册 */
    DynamicExampleModule.register({
      type: 'postgres',
      host: 'localhost',
      port: 123,
    }),
    /** 公用模块，用来实例化全局的增强器，如全局守卫 */
    CommonModule,
    MongooseModule.forRoot('mongodb://localhost:27017/nest-course'),
  ],
  /** 此模块的控制器 */
  controllers: [AppController],
  /**
   * 声明当前模块中可供注入的依赖类型(用Injectable标注的)
   * 需要在providers中声明的依赖是来自当前模块的
   * 且这些依赖只能在当前模块中使用
   * 若要这些依赖被外部模块使用，用下面的exports导出
   * 若要使用外部模块exports导出的依赖，用上面的imports导入
   * 用imports导入的模块中的exports依赖，不用在此providers中声明，可直接使用
   */
  providers: [AppService],
  /** 声明此模块可供其它模块使用的依赖(用Injectable标注的) */
  exports: [],
})
export class AppModule {}
