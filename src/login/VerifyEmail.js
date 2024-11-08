import React, { Component } from "react";
import {getParams, wrap} from "../util/Utils";
import {observable} from "mobx";
import Loading from "../util/Loading";
import Alert from "@mui/material/Alert";
import Server from "../util/Server";
import _ from "lodash";

class VerifyEmail extends Component {
    store = observable ({
        error: null,
        loading: true,
        success: false
    });

    componentDidMount() {
        this.verifyEmail ();
    }

    async verifyEmail () {
        const params = getParams ();
        const { email, token } = params;

        if (! email || ! token) {
            if (! email) {
                this.store.error = "Email is missing.";
            } else {
                this.store.error = "Token is missing.";
            }
            return
        }

        try {
            const mutation = `
                mutation ($email: String!, $token: String!) {
                   res: verifyEmail (email: $email, token: $token)                 
                }
            `;
            const variables = { email, token };
            const req = await Server._gql (mutation, variables);
            this.store.success = true;
        }
        catch (e) {
            if (_.isObject (e)) {
                this.store.error = (
                    <pre>
                        {JSON.stringify (e, null, 2)}
                    </pre>
                );
            } else {
                this.store.error = e.toString ();
            }
        }
    }

    render () {
        const { error, success, loading } = this.store;

        if (error) {
            return (
                <Alert severity="error">
                    {error}
                </Alert>
            );
        } else if (success) {
            return (
                <Alert severity="info">
                    Email address successfully verified. <a href={"#/"}>Click here</a> to login.
                </Alert>
            );
        } else {
            return (
                <Loading show={true} />
            );
        }
    }
}

export default wrap (VerifyEmail);

// EOF