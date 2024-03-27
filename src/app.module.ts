import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoffeesController } from './coffees/coffees.controller';
import { CoffeesService } from './coffees/coffees.service';

@Module({
  /**
   * 声明此模块的依赖模块
   * 依赖模块中exports出来的依赖可直接注入使用
   * 不用在providers中声明
   */
  imports: [],
  /** 此模块的控制器 */
  controllers: [AppController, CoffeesController],
  /** 声明此模块中可供注入的依赖类型(用Injectable标注的) */
  providers: [AppService, CoffeesService],
  /** 声明此模块可供其它模块使用的依赖(用Injectable标注的) */
  exports: [],
})
export class AppModule {}
