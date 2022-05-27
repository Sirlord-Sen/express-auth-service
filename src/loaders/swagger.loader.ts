import { AppConfig, SwaggerConfig } from '@config//';
import { defaultMetadataStorage as classTransformerMetadataStorage } from 'class-transformer/cjs/storage';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { NextFunction, Request, Response } from 'express';
import basicAuth from 'express-basic-auth';
import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework-w3tec';
import { getMetadataArgsStorage } from 'routing-controllers';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import * as swaggerUi from 'swagger-ui-express';

export const swaggerLoader: MicroframeworkLoader = (settings: MicroframeworkSettings | undefined) => {
    if (settings && SwaggerConfig.enabled) {
        const expressApp = settings.getData('express_app');

        const schemas = validationMetadatasToSchemas({
            classTransformerMetadataStorage,
            refPointerPrefix: '#/components/schemas/',
        });

        const swaggerFile = routingControllersToSpec(
            getMetadataArgsStorage(),
            {},
            {
                components: {
                    schemas,
                    securitySchemes: {
                        basicAuth: {
                            type: 'http',
                            scheme: 'basic',
                        },
                    },
                },
            }
        );

        // Add npm infos to the swagger doc
        swaggerFile.info = {
            title: AppConfig.name,
            description: AppConfig.description,
            version: AppConfig.version,
        };

        swaggerFile.servers = [
            {
                url: `${AppConfig.schema}://${AppConfig.host}:${AppConfig.port}/${AppConfig.routePrefix}/`,
            },
        ];

        expressApp.use(
            SwaggerConfig.route,
            SwaggerConfig.username ? basicAuth({
                users: {
                    [`${SwaggerConfig.username}`]: SwaggerConfig.password,
                },
                challenge: true,
            }) : (req: Request, res: Response, next: NextFunction) => next(),
            swaggerUi.serve,
            swaggerUi.setup(swaggerFile)
        );

    }
};