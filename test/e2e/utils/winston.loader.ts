import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework-w3tec';
import { configureLogger } from 'test/utils/logger';

export const winstonLoader: MicroframeworkLoader = async (settings: MicroframeworkSettings | undefined) => {
    configureLogger()
};