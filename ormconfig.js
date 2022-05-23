// const DBConfig = require('./src/config/db.config').default

// const { type ,username, password, database, synchronize, host, port } = DBConfig

module.exports = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'I love God.',
    database: 'authentication',
    synchronize: false,
    entities: ["src/modules/**/*.entity.ts"],
    subscribers: ["src/modules/**/*.subscriber.ts"],
    seeds: ["src/db/seeds/*.seed.ts"],
    factories: ["src/db/factories/*.factory.ts"],
    migrations: ["src/db/migrations/**/*.ts"]
  }