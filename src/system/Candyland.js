import React, { Component } from "react";
import Validator from "../login/Validator";
import {observable} from "mobx";
import {doGql, getParams, wrap} from "../util/Utils";
import ErrorBanner from "../util/ErrorBanner";
import Loading from "../util/Loading";
import TextField from "@mui/material/TextField";
import {AddButton, ReloadButton, ResetButton, ShowButton} from "../util/ButtonUtil";
import Server from "../util/Server";

const fields = [
    {
        path: "employerId",
        name: "Employer ID",
        required: true,
        validator: Validator.oidValidator
    }
];

class Candyland extends Component {
    constructor () {
        super();
        Validator.addValidator (this, fields);
    }

    componentDidMount() {
        const params = getParams ();
        if (params.employerId) {
            this.store.employerId = params.employerId;
        }
        this.validate ();
    }

    store = observable ({
        employerId: "",
        results: null,
        result: null,
        error: null,
        errors: {},
        loading: false,
    });

    render() {
        const { employerId, loading, error, errors } = this.store;

        return (
            <div>
                <h1>Candyland Utilities</h1>

                <ErrorBanner error={error}/>
                <Loading show={loading}/>

                <table className={"CreateJobTaskTable"}>
                    <tbody>
                    <tr>
                        <td colSpan={2}>
                            <TextField
                                label={"Employer ID"}
                                value={employerId}
                                margin={"dense"}
                                size={"small"}
                                fullWidth
                                required={true}
                                onChange={(e) => {
                                    this.store.employerId = e.target.value;
                                    this.validate();
                                }}
                                helperText={errors.employerId}
                                error={Boolean(errors.employerId)}
                                variant="outlined"
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <AddButton
                                label={"create"}
                                disabled={!this.validator.isValid}
                                onClick={() => this.setup ()}
                            />
                        </td>
                        <td>
                            Create Candyland registrations.
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <ResetButton
                                label={"JobTasks"}
                                disabled={!this.validator.isValid}
                                onClick={() => this.createMissing ()}
                            />
                        </td>
                        <td>
                            Create missing job tasks
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <ShowButton
                                disabled={!this.validator.isValid}
                                onClick={() => window.location.hash = `/data/employer/${employerId}`}
                            />
                        </td>
                        <td>
                            Show Employer
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <ReloadButton
                                label={"Process"}
                                disabled={!this.validator.isValid}
                                onClick={() => this.process ()}
                            />
                        </td>
                        <td>
                            Start JobTask processing run
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        );
    }

    async createMissing() {
        const {employerId} = this.store;
        const query = `
            mutation ($employerId: String!) { 
                res: createJobTasksForEmployer (employerId: $employerId)
            }`;
        const variables = {employerId};
        const res = await Server.gql (query, variables);
        if (res.errors.length > 0) {
            this.store.errors = res.errors;
        } else {
            const { snackbarStore } = this.props;
            snackbarStore.show (`Added ${res.data.res} jobtasks.`);
        }
    }

    async process () {
        const {employerId} = this.store;
        const query = `
            mutation ($employerId: String!) { 
                res: processJobTasks (employerId: $employerId)
            }`;
        const variables = {employerId};
        const res = await Server.gql (query, variables);
        if (res.errors.length > 0) {
            this.store.errors = res.errors;
        } else {
            const { snackbarStore } = this.props;
            snackbarStore.show (`Started processing for ${res.data.res} jobTasks.`);
        }
    }

    async setup () {
        const res = await doGql(this);
        if (res) {
            const { snackbarStore } = this.props;
            snackbarStore.show ("Done");
        }
    }

    get query () {
        return `mutation ($employerId: String!) {
            res: setupCandyland (employerId: $employerId) 
        }`;
    }

    get variables () {
        const {employerId} = this.store;
        return {employerId};
    }
}

export default wrap (Candyland);

// EOF