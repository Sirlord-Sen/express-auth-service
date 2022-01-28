import { createConnection } from 'typeorm'
import config from 'config'
import { Logger } from '../utils/logger.util'

const { type, host, port, username, password, database, synchronize,} = config.get('db')

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
            entities: ["src/modules/user/entity/**/*.ts", "src/modules/auth/entity/**/*.ts"]
        })
        Logger.info("Database connected successfully")
    }
    catch(err){
        Logger.error(err)
    }
}