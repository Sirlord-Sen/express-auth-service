import { ConflictError, InternalServerError, NotFoundError} from '@exceptions//';
import { DatabaseError } from 'pg'
import { DeepPartial, EntityNotFoundError, ObjectLiteral, QueryFailedError, Repository } from 'typeorm';

export default class RepositoryCore<Entity extends ObjectLiteral> extends Repository<Entity>{
    async createEntity(body: DeepPartial<Entity>): Promise<Entity> {
        try{
            const entity = this.create(body);
            await this.save(entity);
            return entity;
        }
        catch(err){ throw this.errorHandler(err) }
    }

    async updateEntity( query: DeepPartial<Entity>, body: DeepPartial<Entity> ): Promise<Entity> {
        try{ 
            const refreshToken = await this.findOneOrFail({where: query})
            this.merge(refreshToken, body)
            return await this.save(refreshToken) 
        }
        catch(err){ throw this.errorHandler(err) }
    }

    protected errorHandler(error: unknown){
        if(error instanceof EntityNotFoundError) {
            const entityName = error.message.split("\"")[1].split("Entity")[0]
            throw new NotFoundError(`${entityName} not found`)
        }

        if (error instanceof QueryFailedError) {
            const err = error.driverError as DatabaseError;
            switch (err.code) { 
                case 'ER_DUP_ENTRY':
                case '23505':
                    throw new ConflictError('user already exists')   
            }
          }
        
        throw new InternalServerError()
    }
}