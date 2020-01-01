import {Context} from 'aws-lambda';
import {injectable} from 'inversify';
import {ErrorUtils} from '../errors/errorUtils';
import {CoreApiClaims} from '../security/coreApiClaims';

/*
 * A simple authorizer to extract claims from the request context
 */
@injectable()
export class RequestContextAuthenticator {

    /*
     * Read claims passed into the request context as a result of the previously returned policy document
     */
    public authorizeRequestAndGetClaims(event: any, context: Context): CoreApiClaims {

        if (!event.requestContext ||
            !event.requestContext.authorizer ||
            !event.requestContext.authorizer.customClaims) {

            throw new Error('Unable to resolve authorizer claims from request context');
        }

        // Get claims
        const claims = JSON.parse(event.requestContext.authorizer.customClaims);

        // Make some sanity checks before returning the result
        this._checkClaim(claims, (c) => c.userId, 'userId');
        this._checkClaim(claims, (c) => c.clientId, 'clientId');
        this._checkArrayClaim(claims, (c) => c.scopes, 'scope');
        this._checkClaim(claims, (c) => c.givenName, 'givenName');
        this._checkClaim(claims, (c) => c.familyName, 'familyName');
        this._checkClaim(claims, (c) => c.email, 'email');
        return claims;
    }

    /*
     * Try to read a claim from the supplied object
     */
    private _checkClaim(claims: CoreApiClaims, accessor: (c: CoreApiClaims) => string, claimName: string): void {

        const result = accessor(claims);
        if (!result) {
            throw ErrorUtils.fromMissingClaim(claimName);
        }
    }

    /*
     * Try to read an array claim from the supplied object
     */
    private _checkArrayClaim(claims: CoreApiClaims, accessor: (c: CoreApiClaims) => string[], claimName: string): void {

        const result = accessor(claims);
        if (!result) {
            throw ErrorUtils.fromMissingClaim(claimName);
        }
    }
}
