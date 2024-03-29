import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

/**
 * 每个用@Entity装饰的类都代表一个SQL表（SQL table）
 * typeorm配置synchronize，会自动在数据库中创建此表
 * 表名为lowercase<ClassName>，此处为coffee
 * 也可传入一个字符串给@Entity()来指定表名
 */
@Entity()
export class Coffee {
  /** 自增列 */
  @PrimaryGeneratedColumn()
  id: number;

  /** 指定列，必填，值不能为空 */
  @Column()
  name: string;

  @Column()
  brand: string;

  /** 标识floavors在数据中以json形式存储，并允许null */
  @Column('json', { nullable: true })
  flavors: string[];
}
