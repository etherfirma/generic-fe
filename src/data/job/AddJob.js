import React from 'react';
import {wrap} from "../../util/Utils";
import AddThing from "../thing/AddThing";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Breadcrumb from "../../util/Breadcrumb";
import "./css/AddJob.css";
import Validator from "../../login/Validator";
import {AddButton} from "../../util/ButtonUtil";
import BooleanPicker from "../../util/BooleanPicker";
import EmployerPicker from "../employer/EmployerPicker";
import GeoPicker from "../geo/GeoPicker";
import EnumPicker from "../../util/enum/EnumPicker";
import StringListEditor from "./StringListEditor";
import ToApplyEditor from "./ToApplyEditor";
import LocationEditor from "./LocationEditor";

/**
 * The validation rules for the form fields.
 */

const jobValidationFields = [
    {
        path: "employer",
        name: "Employer",
        required: true,
        validator: Validator.nonNullValidator
    },
    {
        path: "geo",
        name: "Geo",
        required: true,
        validator: Validator.nonNullValidator
    },
    {
        path: "jobKey",
        name: "JobKey",
        required: true,
        validator: Validator.stringValidator
    },
    {
        path: "title",
        name: "Title",
        required: true,
        validator: Validator.stringValidator
    },
    {
        path: "description",
        name: "Description",
        required: true,
        validator: Validator.stringValidator
    },
    {
        path: "state",
        name: "State",
        required: true,
        validator: Validator.stringValidator
    },
    {
        path: "compensation",
        name: "Compensation",
        required: true,
        validator: Validator.stringValidator
    },
    {
        path: "eeoStatement",
        name: "EEO Statement",
        required: true,
        validator: null
    },
    {
        path: "batchId",
        name: "Batch ID",
        required: true,
        validator: Validator.oidValidator
    }
];

class AddJob extends AddThing {
    constructor () {
        super({
            header: "Add Job",
            slug: "job",
            employer: null,
            batchId: "",
            geo: null,
            jobKey: "",
            title: "",
            description: "",
            compensation: "",
            eeoStatement: "",
            location: {
                city: "",
                additional: ""
            },
            toApply: {
                url: "",
                instructions: "",
                contact: ""
            },
            requirements: [""],
            state: "PENDING",
            isActive: false
        });
        this.validate ();
    }

    validator = new Validator (this, jobValidationFields);

    get query () {
        return `
            mutation ($job: JobInput!) {
                res: addJob (job: $job) { 
                    id
                } 
            }`
    }

    get variables () {
        const { title, description, jobKey, state, employer, geo, batchId, eeoStatement, compensation } = this.store;
        return {
            job: {
                title, description, jobKey, state, eeoStatement, compensation,
                employerId: employer.id, batchId,
                geoId: geo.id
            }
        };
    }

    textField (which, label, extra) {
        const { errors } = this.store;
        return (
            <TextField
                {...extra}
                label={label}
                value={this.store[which]}
                margin={"dense"}
                size={"small"}
                fullWidth
                onChange={(e) => {
                    this.store[which] = e.target.value;
                    this.validate ();
                }}
                helperText={errors[which]}
                error={Boolean (errors[which])}
                variant="outlined"
            />
        );
    }

    doRender () {
        const { employer, geo, state } = this.store;
        const { loading, errors } = this.store;

        const formProps = {
            fullWidth: true,
            size: "small"
        };

        return (
            <div>
                <table className={"AddJobTable"} >
                    <tbody>
                    <tr>
                        <td>
                            {this.textField("batchId", "Batch ID")}
                        </td>
                    </tr>
                    <tr>
                        <td>
                        <EmployerPicker
                                value={employer}
                                required={true}
                                onChange={employer => {
                                    this.store.employer = employer;
                                    this.validate();
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
                            {this.textField("jobKey", "Job Key")}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            {this.textField("title", "Title")}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            {this.textField("description", "Description")}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <GeoPicker
                                value={geo?.id}
                                required={true}
                                onChange={geo => {
                                    this.store.geo = geo;
                                    this.validate();
                                }}
                                formProps={formProps}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <LocationEditor label={"Location"} value={this.store.location} setValue={(value) => {
                                this.store.location = value;
                                this.validate();
                            }}>
                                fsdfsadafsd
                            </LocationEditor>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            {this.textField("compensation", "Compensation")}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            {this.textField("eeoStatement", "EEO Statement")}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <ToApplyEditor label={"To Apply"} value={this.store.toApply} setValue={(obj) => {
                                this.store.toApply = obj;
                                this.validate ();
                            }} />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <StringListEditor
                                label={"Requirements"}
                                values={this.store.requirements}
                                setValues={(obj) => {
                                    this.store.requirements = obj;
                                }}
                            />
                        </td>
                    </tr>
                    <tr>
                        <EnumPicker
                            enumType={"JobState"}
                            value={state}
                            onChange={value => this.store.state = value}
                            required={true}
                            formProps={formProps}
                        />
                    </tr>
                    <tr>
                        <td colSpan={2}>
                            <AddButton disabled={loading || !this.isValid} onClick={() => this.doAdd()}/>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        );
    }

    onSuccess(obj) {
        window.location.hash = `#/data/job/${obj}`;
    }

    renderHeader() {
        const {thing} = this.store;
        const crumbs = [
            {label: null, href: "#/"},
            {label: "Jobs", href: "#/data/jobs"},
            {label: "Add Job"}
        ];
        return (
            <div>
                <Breadcrumb crumbs={crumbs}/>
                {super.renderHeader()}
            </div>
        );
    }
}

export default wrap (AddJob);

export {
    jobValidationFields
}

// EOF