import React, { Component } from "react";
import { wrap } from "../../util/Utils";
import _ from "lodash";
import {action, observable} from "mobx";
import {matchPath} from "react-router-dom";
import TextField from "@mui/material/TextField";
import Loading from "../../util/Loading";
import Server from "../../util/Server";
import "./css/EditTemplate.css";
import ErrorBanner from "../../util/ErrorBanner";
import Validator from "../../login/Validator";
import {CancelButton, UpdateButton} from "../../util/ButtonUtil";
import UserPicker from "../user/UserPicker";

/**
 *
 */

const fields = [
    {
        path: "template",
        name: "Template",
        required: true,
        validator: Validator.stringValidator
    },
    {
        path: "path",
        name: "Path",
        required: true,
        validator: Validator.stringValidator
    },
    {
        path: "engine",
        name: "Engine",
        required: true,
        validator: Validator.stringValidator
    },
    {
        path: "sampleContext",
        name: "Sample Context",
        required: true,
        validator: Validator.jsonObjectValidator
    },
    {
        path: "user",
        name: "User",
        required: true,
        validator: Validator.nonNullValidator
    }
];

/**
 *
 */

class EditTemplate extends Component {
    store = observable({
        template: null,
        errors: {},
        error: null,
        results: null,
        loading: false
    });

    validator = new Validator (this, fields, (obj) => obj.store.template);

    get isValid () {
        return this.validator.isValid;
    }

    validate () {
        this.validator.validate();
    }

    componentDidMount() {
        this.store.id = this.params.id;
        this.loadTemplate ();
    }

    get query () {
        return `
            query ($id: String!) {
                res: templateById (id: $id) {
                    id
                    path
                    userId 
                    description
                    sampleContext
                    engine
                    template
                } 
            }
        `;
    }

    async loadTemplate () {
        const {id} = this.store;
        try {
            this.store.error = null;
            this.store.loading = null;
            const template = await Server._gql (this.query, { id });
            template.user = {
                id: template.userId
            };
            this.store.template = template;
            console.log (template);
            this.validate ();
        } catch (e) {
            this.store.error = e;
        } finally {
            this.store.loading = false;
        }
    }

    get params() {
        const match = matchPath({path: "/data/template/:id/edit"}, window.location.hash.substring(1));
        return match?.params;
    }

    textField(which, label, extra) {
        const {template, errors} = this.store;
        return (
            <TextField
                {...extra}
                label={label}
                value={template[which]}
                margin={"dense"}
                size={"small"}
                fullWidth
                onChange={(e) => {
                    template[which] = e.target.value;
                    this.validate();
                }}
                helperText={errors[which]}
                error={Boolean(errors[which])}
                variant="outlined"
            />
        );
    }

    render() {
        const { loading, error, template} = this.store;

        return (
            <div>
                <h1>Edit Template</h1>
                <ErrorBanner error={error} />
                <Loading show={loading} />
                {template && this.renderForm (template)}
            </div>
        );
    }

    renderForm (template) {
        const { errors, loading } = this.store;

        return (
            <div>
                <table className={"EditTemplateTable"} >
                    <tbody>
                    <tr>
                        <td>
                            {this.textField("id", "ID", {disabled: true})}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            {this.textField("path", "Path")}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <UserPicker
                                value={template.user?.id}
                                required={true}
                                onChange={action((user) => template.user = user)}
                                formProps={{
                                    fullWidth: true,
                                    size: "small"
                                }}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            {this.textField("description", "Description")}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            {this.textField("engine", "Engine", {disabled: true})}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <TextField
                                label="Template"
                                value={template.template}
                                margin={"dense"}
                                size={"small"}
                                fullWidth
                                multiline={true}
                                rows={12}
                                onChange={(e) => {
                                    template.template = e.target.value;
                                    this.validate();
                                }}
                                helperText={errors.template}
                                error={Boolean(errors.template)}
                                variant="outlined"
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <TextField
                                label="SampleContext"
                                value={template.sampleContext}
                                margin={"dense"}
                                size={"small"}
                                fullWidth
                                multiline={true}
                                rows={6}
                                onChange={(e) => {
                                    template.sampleContext = e.target.value;
                                    this.validate();
                                }}
                                helperText={errors.sampleContext}
                                error={Boolean(errors.sampleContext)}
                                variant="outlined"
                            />
                        </td>
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
        const {template} = this.store;
        window.location.href = `#/data/template/${template.id}`;
        return;
    }

    async doUpdate() {
        const {template: obj} = this.store;
        const {path, description, id, sampleContext, template} = obj;
        const mutation = `
            mutation ($id: String!, $update: TemplateUpdate!) {
                res: updateTemplate (id: $id, update: $update) {
                    id
                }              
            }
        `;
        const variables = {
            id,
            update: {
                path,
                description,
                template,
                sampleContext
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

export default wrap (EditTemplate);

// EOF