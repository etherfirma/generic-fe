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
import { wrap, objGet} from "../util/Utils";
import LoginBanner from "./LoginBanner";
import Server from "../util/Server";
import Validator from "./Validator";
import Alert from "@mui/material/Alert";
import CheckIcon from '@mui/icons-material/Check';

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
        path: "name",
        name: "Name",
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

class Register extends Component {
    store = observable ({
        email: "",
        password: "",
        name: "",
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

    mutation = `
        mutation ($email: String!, $name: String!, $password: String!) {
            res: registerPassword (email: $email, name: $name, password: $password) {
                id
                name
            }
        }`;

    getVariables () {
        const { email, name, password } = this.store;
        return {
            email, name, password
        };
    }

    async doRegister () {
        const variables = this.getVariables();
        try {
            const res = await Server._gql(this.mutation, variables);
            if (res) {
                this.store.result = (
                    <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
                        Account has been created.
                    </Alert>
                )
            } else {
                this.store.result = res.errors;
            }
        }
        catch (e) {
            const {infoDialogStore} = this.props;
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
            } else {
                return result;
            }
        } else {
            return null;
        }
    }

    render () {
        const { errors, email, name, password } = this.store;
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
                                Register
                            </div>
                            <div className={"LoginText"}>
                                Enter your email and a password to register a new account.
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
                                    id="name"
                                    label="Name"
                                    fullWidth
                                    value={name}
                                    error={Boolean (errors.name)}
                                    helperText={errors.name}
                                    onChange={onChange ("name")}
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
                        </div>
                    </DialogContent>
                    <DialogActions>
                        {/*<div className="g-signin2" data-onsuccess={"onGoogleSignIn"}></div>*/}
                        {/*&nbsp;*/}
                        <Button onClick={() => window.location.hash = "/"} color="primary">
                            Login
                        </Button>
                        &nbsp;
                        <Button onClick={this.doRegister.bind (this)} disabled={! this.isValid} color="secondary">
                            Register
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

export default wrap (Register);

// EOF