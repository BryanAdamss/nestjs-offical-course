import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Flavor } from './flavor.entity/flavor.entity';

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

  /**
   * 定义两个entity的relation
   * @JoinTable一般定义在OWNER一侧
   * 例如此处Coffee有多种口味（flavor）
   * 所以JoinTable定义在Coffee entity即可，Flavor entity无需定义
   * 每个Coffee可以有多个flavor
   * 每个flavor也可以出现在多种Coffee中
   */
  @JoinTable()
  @ManyToMany(
    /** 指定关联的目标Entity类型 */
    (type) => Flavor,
    /** 指定目标Entity上与当前Entity关联的属性 */
    (flavor) => flavor.coffees,
  )
  flavors: string[];
}
