import { Column, Index, PrimaryGeneratedColumn } from 'typeorm';

/** 复合索引，组合多个列 */
@Index(['name', 'type'])
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  /** 普通索引 */
  @Index()
  @Column()
  name: string;

  @Column('json')
  payload: Record<string, any>;
}
