import React, { Component } from "react";
import {AddButton} from "../../../util/ButtonUtil";
import Loading from "../../../util/Loading";
import {observable} from "mobx";
import ErrorBanner from "../../../util/ErrorBanner";
import {doGql, If, PreJson, wrap} from "../../../util/Utils";
import "./css/CreateJobTask.css";
import TextField from "@mui/material/TextField";
import Validator from "../../../login/Validator";
import CheckIcon from "@mui/icons-material/Check";
import Alert from "@mui/material/Alert";
import Breadcrumb from "../../../util/Breadcrumb";

const fields = [
    {
        path: "jobId",
        name: "JobId",
        required: true,
        validator: Validator.oidValidator
    }
];

class CreateJobTask extends Component {
    store = observable ({
        results: null,
        result: null,
        error: null,
        errors: {},
        loading: false,
        jobId: ""
    });

    componentDidMount() {
        this.validator.validate ();
    }

    validator = new Validator (this, fields);

    render() {
        const { errors, error, loading, jobId, result } = this.store;

        const crumbs = [
            { label: null, href: "#/" },
            { label: "JobTasks", href: "#/data/jobTasks" },
            { label: "Create" }
        ];

        return (
            <div>
                <Breadcrumb crumbs={crumbs} />
                <h1>Create JobTask</h1>

                <ErrorBanner error={error} />
                <Loading show={loading} />

                <table className={"CreateJobTaskTable"}>
                    <tbody>
                    <tr>
                        <td>
                            <TextField
                                label={"JobId"}
                                value={jobId}
                                margin={"dense"}
                                size={"small"}
                                fullWidth
                                required={true}
                                onChange={(e) => {
                                    this.store.jobId = e.target.value;
                                    this.validator.validate ();
                                }}
                                helperText={errors.jobId}
                                error={Boolean (errors.jobId)}
                                variant="outlined"
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <AddButton
                                label={"create"}
                                disabled={! this.validator.isValid}
                               onClick={() => this.doCreate ()}
                            />
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        );
    }

    async doCreate () {
        const jobTaskId = await doGql (this);
        if (jobTaskId) {
            window.location.hash = `/data/jobTask/${jobTaskId}`;
        } else if (this.store.results.errors.length === 0) {
            this.store.error = "JobTask could not be created.";
        }
    }

    get query () {
        return `mutation ($jobId: String!) {
            res: createJobTask (jobId: $jobId) 
        }`
    }

    get variables () {
        return {
            jobId: this.store.jobId
        }
    }
}

export default wrap (CreateJobTask);

// EOF