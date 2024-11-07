import _ from 'lodash';
import {objGet} from "./Utils";
import {toJS} from "mobx";

class Server {
    csrfToken = null;
    lastGraphQL = null;
    url = document.location.origin + '/api';
    // url = "https://api-dev.etherfirma.com/api";

    get serverUrl () {
        return this.url;
    }

    set serverUrl (url) {
        this.url = url;
    }

    /**
     * Creates a GraphQL request that is capable of uploading files as part of the request.
     *
     * @param query
     * @param variables
     * @param files
     * @returns {Request}
     */

    graphQLUpload (query, variables, files, serverUrl) {
        if (! variables) {
            variables = {};
        }
        if (_.isString (variables)) {
            variables = JSON.parse (variables);
        }

        const url = serverUrl || this.serverUrl || document.location.origin + '/api';

        // Create the FormData object to submit

        const formData = new FormData ();
        formData.append ('query', query);
        formData.append ('variables', JSON.stringify (variables));

        _.each (files, (file, i) => {
            formData.append ("" + i, file);
        });

        // Send the request

        const request = new Request(url, {
            method: 'POST',
            mode: 'cors',
            redirect: 'follow',
            credentials: 'include',

            headers: new Headers({
                // 'Content-Type': 'multipart/form-data',
                'Accept': 'application/json',
                'Csrf-Token': this.csrfToken
            }),
            body: formData
        });

        return request;
    }

    /**
     * Creates a normal application/json GraphQL request.
     *
     * @param query
     * @param variables
     * @param serverUrl
     * @returns {Request}
     */

    graphQLRequest (query, variables, serverUrl) {
        if (! variables) {
            variables = {};
        }
        if (_.isString (variables)) {
            variables = JSON.parse (variables);
        }

        const url = serverUrl || this.serverUrl || document.location.origin + '/api';
        const headers = {
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json',
        };
        if (! serverUrl) {
            headers['Csrf-Token'] = this.csrfToken;
        }

        // Send the request

        return new Request(url, {
            method: 'POST',
            mode: 'cors',
            redirect: 'follow',
            credentials: 'include',
            headers: new Headers(headers),
            body: JSON.stringify({
                query,
                variables
            })
        });
    }

    /**
     *
     * @param query
     * @param variables
     * @param files
     * @param url
     * @returns {Promise<unknown>}
     */

    async graphQLClient (query, variables, files, url) {
        const request = files.length ? this.graphQLUpload (query, variables, files, url) : this.graphQLRequest (query, variables, url);
        const res = await fetch (request);
        return await res.json ();
    }

    /**
     * Removes any variables that are null since the most recent update to graphql-java
     * doesn't seem to allow this case. Annoying.
     *
     * @param vars
     * @returns {*}
     */

    scrubVariables (vars) {
        if(vars) {
            _.each(vars,(value, key) => {
                if(value === null) {
                    delete vars[key]
                }
            });
        }
        return vars;
    }


    async gql (query, variables, files, headers) {
        // const server = this.settings.server;
        variables = this.scrubVariables (variables);
        const request = files
            ? this.graphQLUpload (query, variables, files, headers)
            : this.graphQLRequest (query, variables, headers);

        const res = await fetch (request);
        return await res.json();
    }

    /**
     * Convenience method that performs a graphql operation and then returns the value returned as
     * res, otherwise throws an exception containing the whole response.
     *
     * @param gql
     * @param vars
     * @param files
     * @param headers
     * @returns {Promise<*>}
     * @private
     */

    async _gql (gql, vars, files, headers) {
        const op = await this.gql (gql, vars, files, headers);
        const res = objGet (op, [ "data", "res" ]);
        if(! _.isNil (res)) {
            return res;
        } else {
            throw op;
        }
    }

}

export default new Server ();

// EOF