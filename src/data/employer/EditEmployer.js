import React, { Component } from "react";
import {doGql, wrap} from "../../util/Utils";
import _ from "lodash";
import {observable} from "mobx";
import {matchPath} from "react-router-dom";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Loading from "../../util/Loading";
import Server from "../../util/Server";
import "./css/EditEmployer.css";
import Alert from "@mui/material/Alert";
import ErrorBanner from "../../util/ErrorBanner";
import Validator from "../../login/Validator";
import {CancelButton, UpdateButton} from "../../util/ButtonUtil";
import BooleanPicker from "../../util/BooleanPicker";

/**
 * The validation rules for the form fields.
 */

const fields = [
    {
        path: "key",
        name: "Key",
        required: true,
        validator: Validator.stringValidator
    },
    {
        path: "name",
        name: "Name",
        required: false,
        validator: Validator.stringValidator
    },
    {
        path: "domain",
        domain: "Domain",
        required: true,
        validator: Validator.domainValidator
    },
];

/**
 *
 */

class EditEmployer extends Component {
    store = observable({
        employer: null,
        errors: {},
        error: null,
        results: null,
        loading: false
    });

    validator = new Validator (this, fields, (obj) => obj.store.employer);

    get isValid () {
        return this.validator.isValid;
    }

    validate () {
        this.validator.validate();
    }

    componentDidMount() {
        this.store.id = this.params.id;
        this.loadEmployer ();
    }

    get query () {
        return `
            query ($id: String!) {
                res: employerById (id: $id) {
                    id
                    key
                    name
                    domain
                    isActive
                } 
            }
        `;
    }

    get variables () {
        const { id } = this.store;
        return { id };
    }

    async loadEmployer () {
        this.store.employer = await doGql (this);
        this.validate ();
    }

    get params() {
        const match = matchPath({path: "/data/employer/:id/edit"}, window.location.hash.substring(1));
        return match?.params;
    }

    textField(which, label, extra) {
        const {employer, errors} = this.store;
        return (
            <TextField
                {...extra}
                label={label}
                value={employer[which]}
                margin={"dense"}
                size={"small"}
                fullWidth
                onChange={(e) => {
                    employer[which] = e.target.value;
                    this.validate();
                }}
                helperText={errors[which]}
                error={Boolean(errors[which])}
                variant="outlined"
            />
        );
    }

    render() {
        const { loading, error, employer} = this.store;

        return (
            <div>
                <h1>Edit Employer</h1>
                <ErrorBanner error={error} />
                <Loading show={loading} />
                {employer && this.renderForm (employer)}
            </div>
        );
    }

    renderForm (employer) {
        const { errors, loading } = this.store;

        return (
            <div>
                <table className={"EditEmployerTable"} >
                    <tbody>
                    <tr>
                        <td>
                            {this.textField("id", "ID", {disabled: true})}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            {this.textField("key", "Key")}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            {this.textField("name", "name")}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            {this.textField("domain", "domain")}
                        </td>
                    </tr>
                    <tr>
                        <BooleanPicker
                            value={this.store.employer.isActive}
                            onChange={(boolean) => {
                                this.store.employer.isActive = boolean;
                                this.validate();
                            }}
                            formProps={{
                                fullWidth: true,
                                size: "small"
                            }}
                        />
                    </tr>
                    <tr>
                        <td colSpan={2}>
                            <UpdateButton disabled={loading || !this.isValid} onClick={() => this.doUpdate()}/>
                            &nbsp;
                            <CancelButton onClick={() => this.doCancel()}/>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        );
    }

    doCancel() {
        const {employer} = this.store;
        window.location.href = `#/data/employer/${employer.id}`;
    }

    async doUpdate () {
        const { employer } = this.store;
        const { id, key, name, domain, isActive } = employer;

        const mutation = `
            mutation ($id: String!, $update: EmployerUpdate!) {
                res: updateEmployer (id: $id, update: $update) {
                    id
                }              
            }
        `;
        const variables = {
            id,
            update: {
                key,
                name,
                domain,
                isActive
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

export default wrap (EditEmployer);

// EOF