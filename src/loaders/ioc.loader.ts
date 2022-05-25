import { Container } from 'typedi';
import { useContainer as ormUseContainer } from 'typeorm';
import { Container as ormContainer } from 'typeorm-typedi-extensions'
import { useContainer as routingUseContainer } from 'routing-controllers'
import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework-w3tec';

export const iocLoader: MicroframeworkLoader = (settings: MicroframeworkSettings | undefined) => {

    ormUseContainer(ormContainer);
    routingUseContainer(Container);
};