import React,  { Component } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import {observable} from 'mobx';
import ValidationUtil from '../util/ValidationUtil';
import _ from 'lodash';
import {wrap, objGet, getParams} from "../util/Utils";
import LoginBanner from "./LoginBanner";
import Server from "../util/Server";
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
        path: "token",
        name: "Token",
        required: true,
        validator: Validator.stringValidator
    },
    {
        path: "password",
        name: "Password",
        required: true,
        validator: Validator.stringValidator
    }
];

class ResetPassword extends Component {
    store = observable ({
        email: "",
        token: "",
        newPassword: "",
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

    componentDidMount() {
        const params = getParams ();
        if (params.email) {
            this.store.email = params.email;
        }
        if (params.token) {
            this.store.token = params.token;
        }
        this.validate ();
    }

    mutation = `
        mutation ($email: String!, $token: String!, $newPassword: String!) {
            res: resetPassword (email: $email, token: $token, password: $newPassword) 
        }`;

    getVariables () {
        const { email, token, newPassword } = this.store;
        return {
            email, token, newPassword
        };
    }

    async doReset () {
        const variables = this.getVariables();
        const {infoDialogStore} = this.props;
        try {
            const res = await Server._gql(this.mutation, variables);
            infoDialogStore.showDialog ({
                title: "Password Reset",
                body: (
                    <div>
                        <p>Your password has been reset.</p>
                    </div>
                )
            });
        }
        catch (e) {
            infoDialogStore.showError (e);
        }
    }

    renderErrors () {
        const { result } = this.store;

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

    render () {
        const { errors, email, token, newPassword } = this.store;
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
                            <div className={"LoginHeader"}>
                                Reset Password
                            </div>
                            <div className={"LoginText"}>
                                Enter a new password to secure your account.
                            </div>
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
                                    autoFocus
                                    margin="dense"
                                    size={"small"}
                                    id="token"
                                    label="Token"
                                    fullWidth
                                    value={token}
                                    error={Boolean (errors.token)}
                                    helperText={errors.token}
                                    onChange={onChange ("token")}
                                />
                                <TextField
                                    margin="dense"
                                    size={"small"}
                                    id="newPassword"
                                    label="Password"
                                    type="password"
                                    fullWidth
                                    value={newPassword}
                                    error={Boolean (errors.newPassword)}
                                    helperText={errors.newPassword}
                                    onChange={onChange ("newPassword")}
                                    onKeyUp={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            this.doLogin ();
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => window.location.hash = "/"} color="primary">
                            Login
                        </Button>
                        &nbsp;
                        <Button onClick={this.doReset.bind (this)} disabled={! this.isValid} color="secondary">
                            Reset Password
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

export default wrap (ResetPassword);

// EOF