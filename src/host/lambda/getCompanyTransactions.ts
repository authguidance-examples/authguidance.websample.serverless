import {Context} from 'aws-lambda';
import 'reflect-metadata';
import {APIFRAMEWORKTYPES, ContainerHelper, DefaultClientError, ResponseWriter} from '../../framework-api-base';
import {LOGICTYPES} from '../../logic/configuration/logicTypes';
import {CompanyService} from '../../logic/services/companyService';
import {SampleApiClaims} from '../claims/sampleApiClaims';
import {HandlerFactory} from './handlerFactory';

/*
 * Our handler acts as a REST controller
 */
const baseHandler = async (event: any, context: Context) => {

    // First get the supplied id and ensure it is a valid integer
    const id = parseInt(event.pathParameters.id, 10);
    if (isNaN(id) || id <= 0) {

        throw new DefaultClientError(
            400,
            'invalid_company_id',
            'The company id must be a positive numeric integer');
    }

    // Get claims produced by the authorizer
    const container = ContainerHelper.current(event);
    const claims = container.get<SampleApiClaims>(APIFRAMEWORKTYPES.CoreApiClaims);

    // Execute the logic
    const service = container.get<CompanyService>(LOGICTYPES.CompanyService);
    const companies = await service.getCompanyTransactions(id, claims.regionsCovered);

    // Write the response
    return ResponseWriter.objectResponse(200, companies);
};

// Create an enriched handler, which wires up framework handling to run before the above handler
const factory = new HandlerFactory();
const handler = factory.enrichHandler(baseHandler);

// Export the handler to serverless.yml
export {handler};
