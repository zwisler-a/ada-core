/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class AuthenticationService {

    /**
     * @returns any
     * @throws ApiError
     */
    public static oAuth2ControllerAuthorize(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/oauth/auth',
        });
    }

    /**
     * @returns any
     * @throws ApiError
     */
    public static oAuth2ControllerTokenExchange(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/oauth/token',
        });
    }

    /**
     * @returns any
     * @throws ApiError
     */
    public static authControllerLogin(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/auth/login',
        });
    }

    /**
     * @returns any
     * @throws ApiError
     */
    public static authControllerDoLogin(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/login',
        });
    }

    /**
     * @returns any
     * @throws ApiError
     */
    public static authControllerLogout(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/auth/logout',
        });
    }

    /**
     * @returns any
     * @throws ApiError
     */
    public static authControllerGetProfile(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/auth/profile',
        });
    }

    /**
     * @returns any
     * @throws ApiError
     */
    public static googleControllerGoogleAuth(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/auth/google',
        });
    }

    /**
     * @returns any
     * @throws ApiError
     */
    public static googleControllerGoogleAuthRedirect(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/auth/google/redirect',
        });
    }

}
