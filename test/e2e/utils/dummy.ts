import faker from 'faker'

export class IDummyUser{
    username?: string
    email?: string
    password?: string
}

export interface IDummyProfile{
    firstname?: string,
    lastname?: string,
    gender?: string
}

export class IUpdateDummy extends IDummyUser{
    profile: IDummyProfile
}


const gender = faker.datatype.number(1);
const firstname = faker.name.firstName(gender);
const lastname = faker.name.lastName(gender);
const email = faker.internet.email(firstname, lastname);
const username = faker.internet.userName(firstname, lastname);
const password = faker.internet.password(12,true)

export const NewDummyUser = (): IDummyUser => {
    return {
        username,
        email,
        password
    }
}

export const NewDummyProfile = (): IDummyProfile => {
    return {
        firstname,
        lastname,
        gender: 'male' 
    }
}

export const updateDummy = (): IUpdateDummy => {
    return {
        username: faker.internet.userName(),
        profile: NewDummyProfile()
    }
}