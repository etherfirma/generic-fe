import React, { Component } from "react";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import _ from 'lodash';
import {wrap, objGet} from "../util/Utils";
import "./css/LoginDialog.css";
import {action, observable, toJS} from "mobx";
import ValidationUtil from "../util/ValidationUtil";
import LoginBanner from "./LoginBanner";
import Server from "../util/Server";
import { GoogleLogin } from '@react-oauth/google';
import AuthManager from "../util/AuthManager";
import Validator from "./Validator";

/**
 * The validation rules for the form fields.
 */

const fields = [
    {
        path: "email",
        name: "Email Address",
        required: true,
        validator: Validator.emailValidator
    },
    {
        path: "password",
        name: "Password",
        required: true,
        validator: Validator.stringValidator
    }
];

/**
 *
 */

class Login extends Component {
    store = observable ({
        email: "admin@etherfirma.com",
        password: "secret",
        errors: {},
        result: null
    });

    validator = new Validator (this, fields);

    get isValid () {
        return this.validator.isValid;
    }

    validate () {
        this.validator.validate();
    }

    renderErrors () {
        const result = toJS (this.store.result);

        if (result) {
            if (_.isString (result)) {
                return (
                    <div className={"LoginErrors"}>
                        {"" + result}
                    </div>
                );
            } else if (_.isArray (result) && result.length) {
                return (
                    <ul>
                        {_.map (result, (error, i) => {
                            return (
                                <div className={"LoginErrors"} key={i}>
                                    {"" + error.message}
                                </div>
                            );
                        })}
                    </ul>
                );
            }
        } else {
            return null;
        }
    }

    doLogin () {
        const { AuthManager } = this.props;
        AuthManager.skip ();
        return;

        // const { AuthManager } = this.props;
        const { email, password } = this.store;
        AuthManager.login (email, password);
        window.location.hash = window.location.hash;
        return;
    }

    componentDidMount() {
        this.validate();
    }



    render() {
        const { errors, email, password } = this.store;

        const onChange = (which) => (e) => {
            this.store[which] = e.target.value;
            this.validate ();
        };

        return (
            <div className={"LoginWrapper"}>
                <Dialog
                    open={true}
                    fullWidth={true}
                    maxWidth={"sm"}
                >
                    <DialogContent>
                        <DialogContentText>
                        </DialogContentText>
                        <LoginBanner />
                        <div className={"LoginContent"}>
                            {this.renderErrors ()}
                            <div className={"LoginForm"}>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    size={"small"}
                                    id="email"
                                    label="Email Address"
                                    type="email"
                                    fullWidth
                                    value={email}
                                    error={Boolean (errors.email)}
                                    helperText={errors.email}
                                    onChange={onChange ("email")}
                                />
                                <TextField
                                    margin="dense"
                                    size={"small"}
                                    id="password"
                                    label="Password"
                                    type="password"
                                    fullWidth
                                    value={password}
                                    error={Boolean (errors.password)}
                                    helperText={errors.password}
                                    onChange={onChange ("password")}
                                    onKeyUp={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            this.doLogin ();
                                        }
                                    }}
                                />
                            </div>
                            <br/>
                            {/*<GoogleLogin*/}
                            {/*    onSuccess={(response) => this.googleSuccess (response)}*/}
                            {/*    onError={(error) => this.googleError (error)}*/}
                            {/*/>*/}
                        </div>
                    </DialogContent>
                    <DialogActions>
                        {/*<Button onClick={() => this.sendLink ()} disabled={Boolean (errors.email)} color="primary">*/}
                        {/*    Send Link*/}
                        {/*</Button>*/}
                        &nbsp;
                        <Button onClick={() => window.location.hash = "/register"} color="primary" size={"small"}>
                            Register
                        </Button>
                        &nbsp;
                        <Button onClick={() => window.location.hash = "/forgot"} color="primary" size={"small"}>
                            Forgot Password
                        </Button>
                        &nbsp;
                        <Button onClick={() => this.doLogin ()} disabled={! this.isValid} color="secondary" size={"small"}>
                            Login
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }

    async sendLink () {
        const { email } = this.store;
        const mutation = `
            mutation ($email: String!) {
                res: sendLoginLink (email: $email) 
            }
        `;
        const variables = { email };
        const {infoDialogStore} = this.props;
        try {
            const res = await Server._gql(mutation, variables);

            infoDialogStore.showDialog({
                title: "Login Link Sent",
                body: (
                    <p>Check your email for a login link.</p>
                )
            });
        }
        catch (e) {
            infoDialogStore.showError (e);
        }
        return
    }

    /**
     * A handler for the successful response from the Google OAuth login.
     *
     * @param response
     */

    async googleSuccess (success) {
        try {
            await AuthManager.loginGoogle (success);
            window.location.hash = "/";
        }
        catch (e) {
            const { infoDialogStore } = this.props;
            infoDialogStore.showError (e);
        }
        return;
    }

    /**
     * A handler for the error response from the attempted Google OAuth login.
     *
     * @param error
     */

    googleError (error) {
        const { infoDialogStore } = this.props;
        infoDialogStore.showError (error);
        return
    }
}

export default wrap (Login);

// EOF