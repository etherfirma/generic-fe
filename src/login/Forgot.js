import React, { Component } from "react";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import {action, observable, toJS} from 'mobx';
import ValidationUtil from '../util/ValidationUtil';
import { wrap } from "../util/Utils";
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
    }
];

class Forgot extends Component {
    store = observable ({
        email: "",
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
        this.validate ();
    }

    async doForgotPassword () {
        // this.store.result = "Unimplemented.";
        // const { infoDialogStore } = this.props;
        // infoDialogStore.showDialog ({
        //     title: "Feature Unimplemented",
        //     body: (
        //         <p>You didn't <b>really</b> think this was working, did you? </p>
        //     )
        // });

        const mutation = `
            mutation ($email: String!) { 
                res: forgotPassword (email: $email)          
            }`;
        const { email } = this.store;
        const variables = { email };
        const res = await Server._gql (mutation, variables);

        // Let them know to check their email

        const message = "Check your email for a reset message";
        const { infoDialogStore } = this.props;
        infoDialogStore.showDialog ({
            title: "Forgot Password",
            body: (
                <p>{message}</p>
            )
        });

        return;

    }

    renderErrors () {
        const { result } = this.store;

        if (result) {
            return (
                <div className={"LoginErrors"}>
                    {"" + result}
                </div>
            );
        } else {
            return null;
        }

        // const errors = toJS (this.store.errors);
        //
        // if (errors) {
        //     if (_.isString (errors)) {
        //         return (
        //             <div className={"LoginError"}>
        //                 {"" + errors}
        //             </div>
        //         );
        //     } else if (_.isArray (errors) && errors.length) {
        //         return (
        //             <ul>
        //                 {_.map (errors, (error, i) => {
        //                     return (
        //                         <div className={"LoginError"} key={i}>
        //                             {"" + error.message}
        //                         </div>
        //                     );
        //                 })}
        //             </ul>
        //         );
        //     }
        // } else {
        //     return null;
        // }
    }

    render () {
        const { errors, email } = this.store;

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
                                Forgot Password
                            </div>
                            <div className={"LoginText"}>
                                Enter your email address to receive a link to reset your password.
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
                                    onChange={(e) => {
                                        this.store.email = e.target.value;
                                        this.validate ();
                                    }
                                    }
                                />
                            </div>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => window.location.hash = "/register"} color="primary">
                            Register
                        </Button>
                        &nbsp;
                        <Button onClick={() => window.location.hash = "/"} color="primary">
                            Login
                        </Button>
                        &nbsp;
                        <Button
                            onClick={() => this.doForgotPassword (this)}
                            disabled={! this.isValid}
                            color="secondary"
                        >
                            Reset Password
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

export default wrap (Forgot);

// EOF