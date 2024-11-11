import React, { Component } from "react";
import {doGql, PreJson, wrap} from "../../util/Utils";
import _ from "lodash";
import {observable} from "mobx";
import {matchPath} from "react-router-dom";
import TextField from "@mui/material/TextField";
import Loading from "../../util/Loading";
import Server from "../../util/Server";
import "./css/EditJob.css";
import ErrorBanner from "../../util/ErrorBanner";
import Validator from "../../login/Validator";
import {CancelButton, UpdateButton} from "../../util/ButtonUtil";
import BooleanPicker from "../../util/BooleanPicker";
import {jobValidationFields} from "./AddJob";
import EmployerPicker from "../employer/EmployerPicker";
import GeoPicker from "../geo/GeoPicker";
import EnumPicker from "../../util/enum/EnumPicker";

/**
 *
 */

class EditJob extends Component {
    store = observable({
        job: null,
        errors: {},
        error: null,
        results: null,
        loading: false
    });

    validator = new Validator (this, jobValidationFields, (obj) => obj.store.job);

    get isValid () {
        return this.validator.isValid;
    }

    validate () {
        this.validator.validate();
    }

    componentDidMount() {
        this.store.id = this.params.id;
        this.loadJob ();
    }

    get query () {
        return `
            query ($id: String!) {
                res: jobById (id: $id) {
                    id
                    employer { id name key } 
                    geo { id name key } 
                    jobKey
                    title
                    description 
                    state
                } 
            }
        `;
    }

    get variables () {
        const { id } = this.store;
        return { id };
    }

    async loadJob () {
        this.store.job = await doGql (this);
        this.validate ();
    }

    get params() {
        const match = matchPath({path: "/data/job/:id/edit"}, window.location.hash.substring(1));
        return match?.params;
    }

    textField(which, label, extra) {
        const {job, errors} = this.store;
        return (
            <TextField
                {...extra}
                label={label}
                value={job[which]}
                margin={"dense"}
                size={"small"}
                fullWidth
                onChange={(e) => {
                    job[which] = e.target.value;
                    this.validate();
                }}
                helperText={errors[which]}
                error={Boolean(errors[which])}
                variant="outlined"
            />
        );
    }

    render() {
        const { loading, error, job} = this.store;

        return (
            <div>
                <h1>Edit Job</h1>
                <ErrorBanner error={error} />
                <Loading show={loading} />
                {job && this.renderForm (job)}
            </div>
        );
    }

    renderForm (job) {
        const { errors, loading } = this.store;

        const formProps = {
            fullWidth: true,
            size: "small"
        };

        return (
            <div>
                <table className={"EditJobTable"} >
                    <tbody>
                    <tr>
                        <td>
                            {this.textField("id", "ID", {disabled: true})}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <EmployerPicker
                                value={job.employer}
                                required={true}
                                disabled={true}
                                onChange={employer => {
                                    this.store.job.employer = employer;
                                    this.validate ();
                                }}
                                formProps={{
                                    fullWidth: true,
                                    size: "small"
                                }}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <GeoPicker
                                value={job.geo?.id}
                                required={true}
                                disabled={true}
                                onChange={geo => {
                                    this.store.job.geo = geo;
                                    this.validate ();
                                }}
                                formProps={{
                                    fullWidth: true,
                                    size: "small"
                                }}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            {this.textField("jobKey", "Job Key", {disabled: true})}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            {this.textField("title", "Title", {disabled: true})}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            {this.textField("description", "Description", {disabled: true})}
                        </td>
                    </tr>
                    <tr>
                        <EnumPicker
                            enumType={"JobState"}
                            value={job.state}
                            onChange={value => job.state = value}
                            required={true}
                            formProps={formProps}
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
        const {job} = this.store;
        window.location.href = `#/data/job/${job.id}`;
    }

    async doUpdate() {
        const {job} = this.store;
        const { id, state } = job;

        const mutation = `
            mutation ($id: String!, $update: JobUpdate!) {
                res: updateJob (id: $id, update: $update) {
                    id
                }              
            }
        `;
        const variables = {
            id,
            update: {
                state
            }
        };
        try {
            this.store.loading = true;
            this.store.error = null;
            await Server._gql(mutation, variables)
            this.doCancel();
        } catch (e) {
            this.store.error = e?.errors[0]?.message || e.toString();
        } finally {
            this.store.loading = false;
        }
    }
}

export default wrap(EditJob);

// EOF