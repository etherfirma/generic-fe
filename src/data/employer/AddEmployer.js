import React from 'react';
import {wrap} from "../../util/Utils";
import AddThing from "../thing/AddThing";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Breadcrumb from "../../util/Breadcrumb";
import "./css/AddEmployer.css";
import Validator from "../../login/Validator";
import {AddButton} from "../../util/ButtonUtil";
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
        required: true,
        validator: Validator.stringValidator
    },
];

class AddEmployer extends AddThing {
    constructor () {
        super({
            header: "Add Employer",
            slug: "employer",
            key: "",
            name: "",
            isActive: false
        });
        this.validate ();
    }

    validator = new Validator (this, fields);

    get query () {
        return `
            mutation ($employer: EmployerInput!) {
                res: addEmployer (employer: $employer) { 
                    id
                } 
            }`
    }

    get variables () {
        const { name, key, isActive } = this.store;
        return {
            employer: {
                key,
                name,
                isActive
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
        const { key, name, isActive } = this.store;
        const { loading, errors } = this.store;

        return (
            <div>
                <table className={"AddEmployerTable"} >
                    <tbody>
                    <tr>
                        <td>
                            {this.textField ("key", "Key")}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            {this.textField ("name", "Name")}
                        </td>
                    </tr>
                    <tr>
                        <BooleanPicker
                            value={isActive}
                            onChange={(boolean) => {
                                this.store.isActive = boolean;
                                this.validate ();
                            }}
                            required={false}
                            formProps={{
                                fullWidth: true,
                                size: "small"
                            }}
                        />
                    </tr>
                    <tr>
                        <td colSpan={2}>
                            <AddButton disabled={loading || ! this.isValid} onClick={() => this.doAdd ()} />
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        );
    }

    onSuccess (obj) {
        window.location.hash = `#/data/employer/${obj}`;
    }

    renderHeader () {
        const { thing } = this.store;
        const crumbs = [
            { label: null, href: "#/" },
            { label: "Employers", href: "#/data/employers" },
            { label: "Add Employer" }
        ];
        return (
            <div>
                <Breadcrumb crumbs={crumbs} />
                {super.renderHeader ()}
            </div>
        );
    }
}

export default wrap (AddEmployer);

// EOF