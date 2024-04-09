import { MigrationInterface, QueryRunner } from 'typeorm';

export class CoffeeRefactor1712675393163 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    /** 需要执行的数据库变更脚本 */
    await queryRunner.query(
      `ALERT TABLE "coffee" RENAME COLUMN "name" TO "title"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    /** 回退时执行的数据库变更脚本 */
    await queryRunner.query(
      `ALERT TABLE "coffee" RENAME COLUMN "title" TO "name"`,
    );
  }
}
