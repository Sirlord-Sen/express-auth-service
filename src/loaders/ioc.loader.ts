import { useContainer as classValidatorUseContainer } from 'class-validator';
import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework-w3tec';
import { useContainer as routingUseContainer } from 'routing-controllers'
import { Container } from 'typedi';
import { Container as ormContainer } from 'typeorm-typedi-extensions'
import { useContainer as ormUseContainer } from 'typeorm';

export const iocLoader: MicroframeworkLoader = (settings: MicroframeworkSettings | undefined) => {

    /**
     * Setup routing-controllers to use typedi container.
     */
    ormUseContainer(ormContainer);
    routingUseContainer(Container);
    classValidatorUseContainer(Container);
};