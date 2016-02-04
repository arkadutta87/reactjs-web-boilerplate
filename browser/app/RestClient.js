import _ from 'lodash';
import Promise from 'bluebird';
import Rest from 'rest';
import ErrorCode from 'rest/interceptor/errorCode';
import PathPrefix from 'rest/interceptor/pathPrefix';

export default class RestClient {
    constructor(config) {
        const _baseUrl = config.baseUrl || '';
        const _minErrorCode = config.minErrorCode || 400;
        this._isJson = config.json || true;

        this.restClient = Rest
          .wrap(PathPrefix, {prefix: _baseUrl})
          .wrap(ErrorCode, {code: _minErrorCode});
    }

    get(path, _headers) {
        let headers = _headers;

        if (_.isEmpty(headers)) {
            headers = {};
        }

        if (this._isJson) {
            headers['Content-Type'] = 'application/json;charset=UTF-8';
        }

        const responseHandler = (response) => {
            let responseEntity = response.entity;
            if (this._isJson) {
                try {
                    responseEntity = JSON.parse(responseEntity);
                } catch (err) {
                    responseEntity = response.entity;
                }
            }

            const resolveObject = {
                statusCode: response.status.code,
                headers: response.headers,
                entity: responseEntity
            };

            //console.log('Get::Resolve Object: ' + JSON.stringify(resolveObject));

            return Promise.resolve(resolveObject);
        };

        const errorHandler = (error) => {
            //alert('Got error response: ' + JSON.stringify(error));
            let responseEntity = error.entity;
            if (this._isJson) {
                try {
                    responseEntity = JSON.parse(responseEntity);
                } catch (err) {
                    console.error('Error in parsing response entity to JSON: ', JSON.stringify(error.entity));
                    responseEntity = error.entity;
                }
            }

            const rejectObject = {
                statusCode: error.status.code,
                headers: error.headers,
                entity: responseEntity,
                error: error.error
            };
            console.error('Reject Object: ', JSON.stringify(rejectObject), JSON.stringify(error));

            return Promise.reject(rejectObject);
        };

        return this.restClient({method: 'GET', path, headers})
          .then(responseHandler, errorHandler);
    }

    post(path, data, _headers) {
        let headers = _headers;

        if (_.isEmpty(headers)) {
            headers = {};
        }

        let entity = data;

        if (this._isJson) {
            headers['Content-Type'] = 'application/json;charset=UTF-8';
            entity = JSON.stringify(data);
        }

        const responseHandler = (response) => {
            let responseEntity = response.entity;
            if (this._isJson) {
                try {
                    responseEntity = JSON.parse(responseEntity);
                } catch (err) {
                    console.error('Error in parsing response entity to JSON: ', response.entity);
                    responseEntity = response.entity;
                }
            }

            const resolveObject = {
                statusCode: response.status.code,
                headers: response.headers,
                entity: responseEntity
            };

            return Promise.resolve(resolveObject);
        };

        const errorHandler = (error) => {
            let responseEntity = error.entity;
            if (this._isJson) {
                try {
                    responseEntity = JSON.parse(responseEntity);
                } catch (err) {
                    console.error('Error in parsing response entity to JSON: ', error.entity);
                    responseEntity = error.entity;
                }
            }

            const rejectObject = {
                statusCode: error.status.code,
                headers: error.headers,
                entity: responseEntity,
                error: error.error
            };

            console.error('Reject Object: ', JSON.stringify(rejectObject));

            return Promise.reject(rejectObject);
        };

        return this.restClient({method: 'POST', path, headers, entity})
          .then(responseHandler, errorHandler);
    }
}