import {internet, name } from 'faker'
import User from '../../../src/modules/user/entity/user.entity'
import UserService  from '../../../src/modules/user/services/user.service'


type DummyUser = { 
    username: string,
    firstname: string,
    surname: string,
    email: string,
    password: string
}

type AuthorizedDummyUser = {
    email: string, 
    password: string, 
    name: string, 
    userId: string, 
    token: string
}

export function dummy(){
    return {
        username: internet.userName(),
        firstname: name.firstName(),
        surname: name.lastName(),
        email: internet.email(),
        password: internet.password()
    }
}

export async function createDummy(){
    const user = dummy()
    const dbUser = User.create(user)
    dbUser.save()
    return { ...user, id: dbUser.id }
}
