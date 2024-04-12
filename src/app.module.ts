import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoffeesModule } from './coffees/coffees.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoffeeRatingModule } from './coffee-rating/coffee-rating.module';
import { DynamicExampleModule } from './dynamic-example/dynamic-example.module';

@Module({
  /**
   * 声明此模块的依赖模块
   * 依赖模块中exports出来的依赖可直接注入使用
   * 不用在providers中声明
   */
  imports: [
    CoffeesModule,
    /** typeorm连接数据库配置 */
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '192.168.50.22',
      port: 15432,
      username: 'postgres',
      password: 'pass123',
      database: 'postgres',
      /** 自动加载模块 */
      autoLoadEntities: true,
      /** 同步数据，确保typeorm实体在每次运行应用程序时都与数据库同步，生产禁用 */
      synchronize: true,
    }),
    CoffeeRatingModule,
    /** 调用动态模块的静态方法实现注册 */
    DynamicExampleModule.register({
      type: 'postgres',
      host: 'localhost',
      port: 123,
    }),
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
