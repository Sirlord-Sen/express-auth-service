// const DBConfig = require('./src/config/db.config').default
const resolve = require('path').resolve
// const { type ,username, password, database, synchronize, host, port } = DBConfig

module.exports = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'I love God.',
    database: 'authentication',
    synchronize: false,
    entities: [resolve(__dirname, "src/api/modules/**/*.entity.ts")],
    subscribers: [resolve(__dirname, "src/api/modules/**/*.subscriber.ts")],
    migrations: [resolve(__dirname, "src/database/migrations/**/*.ts")],
    seeds: ["src/database/seeds/**/*.seed.ts"],
    factories: ["src/database/factories/**/*.factory.ts"],
  }