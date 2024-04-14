import { registerAs } from '@nestjs/config';

/** 注册一个coffees命名空间下的配置 */
export default registerAs('coffees', () => ({
  foo: 'bar',
}));
