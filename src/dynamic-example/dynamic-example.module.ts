import { DynamicModule } from '@nestjs/common';
import { ConnectionOptions } from 'typeorm';

/** 通过@module声明的为静态模块，无法动态接收配置 */
// @Module({
//   providers: [
//     {
//       provide: 'CONNECTION',
//       useValue: createConnection({
//         type: 'postgres',
//         host: 'localhost',
//         port: 5432,
//       }),
//     },
//   ],
// })
/** 通过提供register方法，接收options返回DynamicModule，来实现动态配置 */
export class DynamicExampleModule {
  static register(options: ConnectionOptions): DynamicModule {
    return {
      module: DynamicExampleModule,
      providers: [
        {
          provide: 'CONNECTION',
          useValue: (options) =>
            console.log('dynamicMoculeOptions :>> ', options),
        },
      ],
    };
  }
}
