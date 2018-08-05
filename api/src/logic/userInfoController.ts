import {Request, Response} from 'express';
import {UserInfoClaims} from '../entities/userInfoClaims';
import {ApiLogger} from '../plumbing/apiLogger';
import {ResponseWriter} from '../plumbing/responseWriter';

/*
 * A simple API controller to return user info
 */
export class UserInfoController {

    /*
     * Return user info to the UI
     */
    public static getUserClaims(request: Request, response: Response): void {

        ApiLogger.info('UserInfoController', 'Returning user info');
        const userInfo = response.locals.claims.userInfo;
        ResponseWriter.writeObject(response, 200, userInfo);
    }
}
