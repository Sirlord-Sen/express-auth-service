import { PlatformNetwork } from '@platform-module/platform.types'
import { Gender } from '@utils/utility-types'
import faker from 'faker'
import * as uuid from 'uuid'

export class IDummyUser{
    username: string
    email: string
    password?: string
}

export interface IDummyProfile{
    firstname?: string,
    lastname?: string,
    gender?: Gender,
    picture?: string
}

export interface IDummyPlatform{
    name: PlatformNetwork;
    ssid: string;
    url?: string;
    userId?: string;
  
}

export class IUpdateDummy{
    username?: string
    email?: string
    profile: IDummyProfile
}


const gender = faker.datatype.number(1);
const firstname = faker.name.firstName(gender);
const lastname = faker.name.lastName(gender);
const email = faker.internet.email(firstname, lastname);
const username = faker.internet.userName(firstname, lastname);
const picture = faker.image.avatar()
const password = faker.internet.password(12,true)
const ssid = uuid.v4()

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
        gender: Gender.MALE,
        picture
    }
}

export const NewDummyPlatform = () :IDummyPlatform => {
    return {
        name: PlatformNetwork.FACEBOOK,
        ssid,
    }
}

export const updateDummy = (): IUpdateDummy => {
    return {
        username: faker.internet.userName(),
        profile: NewDummyProfile()
    }
}