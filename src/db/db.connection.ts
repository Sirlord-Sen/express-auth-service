import { createConnection } from 'typeorm'
import { Logger } from '../utils/logger.util'
import { DBConfig } from '../config/'

const { type ,username, password, database, synchronize, host, port } = DBConfig

export const Connection = async() => {
    try{
        await createConnection({
            type,
            host,
            port,
            username,
            password,
            database,
            synchronize,
            entities: ["src/modules/**/*.entity.ts"],
            subscribers: ["src/modules/**/*.subscriber.ts"]
        })
        Logger.info("Database connected successfully")
    }
    catch(err){
        Logger.error(err)
    }
}