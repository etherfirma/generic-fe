import React, { Component } from "react";
import {doGql, wrap} from "../../util/Utils";
import _ from "lodash";
import {observable} from "mobx";
import {matchPath} from "react-router-dom";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Loading from "../../util/Loading";
import Server from "../../util/Server";
import "./css/EditSender.css";
import Alert from "@mui/material/Alert";
import ErrorBanner from "../../util/ErrorBanner";
import Validator from "../../login/Validator";
import {CancelButton, UpdateButton} from "../../util/ButtonUtil";

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
        required: false,
        validator: Validator.stringValidator
    },
    {
        path: "label",
        name: "Label",
        required: true,
        validator: Validator.stringValidator
    }
];

/**
 *
 */

class EditSender extends Component {
    store = observable({
        sender: null,
        errors: {},
        error: null,
        results: null,
        loading: false
    });

    validator = new Validator (this, fields, (obj) => obj.store.sender);

    get isValid () {
        return this.validator.isValid;
    }

    validate () {
        this.validator.validate();
    }

    componentDidMount() {
        this.store.id = this.params.id;
        this.loadSender ();
    }

    get query () {
        return `
            query ($id: String!) {
                res: senderById (id: $id) {
                    id
                    label 
                    email
                    name
                } 
            }
        `;
    }

    get variables () {
        const { id } = this.store;
        return { id };
    }

    async loadSender () {
        this.store.sender = await doGql (this);
        this.validate ();
    }

    get params() {
        const match = matchPath({path: "/data/sender/:id/edit"}, window.location.hash.substring(1));
        return match?.params;
    }

    textField(which, label, extra) {
        const {sender, errors} = this.store;
        return (
            <TextField
                {...extra}
                label={label}
                value={sender[which]}
                margin={"dense"}
                size={"small"}
                fullWidth
                onChange={(e) => {
                    sender[which] = e.target.value;
                    this.validate();
                }}
                helperText={errors[which]}
                error={Boolean(errors[which])}
                variant="outlined"
            />
        );
    }

    render() {
        const { loading, error, sender} = this.store;

        return (
            <div>
                <h1>Edit Sender</h1>
                <ErrorBanner error={error} />
                <Loading show={loading} />
                {sender && this.renderForm (sender)}
            </div>
        );
    }

    renderForm (sender) {
        const { errors, loading } = this.store;

        return (
            <div>
                <table className={"EditSenderTable"} >
                    <tbody>
                    <tr>
                        <td>
                            {this.textField ("id", "ID", { disabled: true })}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            {this.textField ("label", "Label")}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            {this.textField ("email", "Email")}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            {this.textField ("name", "name")}
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={2}>
                            <UpdateButton disabled={loading || ! this.isValid} onClick={() => this.doUpdate ()} />
                            &nbsp;
                            <CancelButton onClick={() => this.doCancel ()} />
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        );
    }

    doCancel () {
        const { sender } = this.store;
        window.location.href = `#/data/sender/${sender.id}`;
        return;
    }

    async doUpdate () {
        const { sender: obj } = this.store;
        const { id, label, email, name } = obj;
        const mutation = `
            mutation ($id: String!, $update: SenderUpdate!) {
                res: updateSender (id: $id, update: $update) {
                    id
                }              
            }
        `;
        const variables = {
            id,
            update: {
                label, email, name
            }
        };
        try {
            this.store.loading = true;
            this.store.error = null;
            await Server._gql (mutation, variables)
            this.doCancel ();
        }
        catch (e) {
            this.store.error = e?.errors[0]?.message || e.toString ();
        }
        finally {
            this.store.loading = false;
        }
    }
}

export default wrap (EditSender);

// EOF