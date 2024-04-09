module.exports = {
  type: 'postgres',
  host: 'localhost', // 需要操作的数据库主机地址
  port: 5432,
  username: 'postgres',
  password: 'pass123',
  database: 'postgres', // 数据库名称
  entities: ['dist/**/*.entity.js'], // 实体文件路径，需要编译后的
  migrations: ['dist/migrations/*.js'], // 编译后的迁移脚本路径
  cli: {
    migrationsDir: 'src/migrations', // 生成的源迁移脚本路径
  },
};
