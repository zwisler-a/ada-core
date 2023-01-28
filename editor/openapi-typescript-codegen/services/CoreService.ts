/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { NetworkDto } from '../models/NetworkDto';
import type { NodeDefinitionDto } from '../models/NodeDefinitionDto';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class CoreService {

    /**
     * @returns NodeDefinitionDto
     * @throws ApiError
     */
    public static getAvailableNodes(): CancelablePromise<Array<NodeDefinitionDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/core/node/available',
        });
    }

    /**
     * @returns NetworkDto
     * @throws ApiError
     */
    public static getAllNetworks(): CancelablePromise<Array<NetworkDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/core/network',
        });
    }

    /**
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static saveNetwork(
        requestBody: NetworkDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/core/network',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @param identifier
     * @returns any
     * @throws ApiError
     */
    public static deleteNetwork(
        identifier: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/core/network/{identifier}',
            path: {
                'identifier': identifier,
            },
        });
    }

    /**
     * @param networkId
     * @returns any
     * @throws ApiError
     */
    public static startNetwork(
        networkId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/core/network/start/{networkId}',
            path: {
                'networkId': networkId,
            },
        });
    }

    /**
     * @param networkId
     * @returns any
     * @throws ApiError
     */
    public static stopNetwork(
        networkId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/core/network/stop/{networkId}',
            path: {
                'networkId': networkId,
            },
        });
    }

}
