import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework-w3tec';

import { createRedisConnection } from '../../utils/cache';

export const redisLoader: MicroframeworkLoader = async (settings: MicroframeworkSettings | undefined) => {

    const client = await createRedisConnection();
    if (settings) {
        settings.setData('redis', client);
        settings.onShutdown(async() => await client.quit());
    }
};