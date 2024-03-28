import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoffeesModule } from './coffees/coffees.module';

@Module({
  /**
   * 声明此模块的依赖模块
   * 依赖模块中exports出来的依赖可直接注入使用
   * 不用在providers中声明
   */
  imports: [CoffeesModule],
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
