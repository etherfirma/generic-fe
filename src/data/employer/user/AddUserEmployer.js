import React from 'react';
import {getParams, PreJson, wrap} from "../../../util/Utils";
import AddThing from "../../thing/AddThing";
import TextField from "@mui/material/TextField";
import Breadcrumb from "../../../util/Breadcrumb";
import "./css/AddUserEmployer.css";
import Validator from "../../../login/Validator";
import {AddButton} from "../../../util/ButtonUtil";
import BooleanPicker from "../../../util/BooleanPicker";
import EmployerPicker from "../EmployerPicker";
import GeoPicker from "../../geo/GeoPicker";
import {matchPath} from "react-router";
import UserPicker from "../../user/UserPicker";

/**
 * The validation rules for the form fields.
 */

const fields = [
    {
        path: "employer",
        name: "Employer",
        required: true,
        validator: Validator.nonNullValidator
    },
    {
        path: "user",
        name: "User",
        required: true,
        validator: Validator.nonNullValidator
    }
];

class AddUserEmployer extends AddThing {
    constructor () {
        super({
            header: "Add UserEmployer",
            slug: "userEmployer",
            employer: null,
            user: null,
            isActive: false
        });
        this.validate ();
    }

    validator = new Validator (this, fields);

    componentDidMount() {
        const params = getParams ();
        if (params.employerId) {
            this.store.employer = {
                id: params.employerId
            };
        }
        if (params.userId) {
            this.store.user = {
                id: params.userId
            };
        }
        return;
    }


    get query () {
        return `
            mutation ($userEmployer: UserEmployerInput!) {
                res: addUserEmployer (userEmployer: $userEmployer) { 
                    id
                } 
            }`
    }

    get variables () {
        const { employer, user, isActive } = this.store;
        return {
            userEmployer: {
                employerId: employer.id,
                userId: user.id,
                isActive
            }
        };
    }

    doRender () {
        const { employer, user, isActive } = this.store;
        const { loading, errors } = this.store;

        const formProps = {
            fullWidth: true,
            size: "small"
        };

        return (
            <div>
                <table className={"AddUserEmployerTable"} >
                    <tbody>
                    <tr>
                        <td>
                            <EmployerPicker
                                value={employer}
                                onChange={employer => {
                                    this.store.employer = employer;
                                    this.validate();
                                }}
                                required={true}
                                formProps={formProps}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <UserPicker
                                value={user}
                                onChange={user => {
                                    this.store.user = user;
                                    this.validate ();
                                }}
                                required={true}
                                formProps={formProps}
                            />
                        </td>
                    </tr>
                    <tr>
                        <BooleanPicker
                            value={isActive}
                            onChange={(boolean) => {
                                this.store.isActive = boolean;
                                this.validate ();
                            }}
                            label={"IsActive?"}
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
    )
        ;
    }

    onSuccess(obj) {
        window.location.hash = `#/data/userEmployer/${obj}`;
    }

    renderHeader() {
        const {thing} = this.store;
        const crumbs = [
            {label: null, href: "#/"},
            {label: "userEmployers", href: "#/data/userEmployers" },
            { label: "Add userEmployer" }
        ];
        return (
            <div>
                <Breadcrumb crumbs={crumbs} />
                {super.renderHeader ()}
            </div>
        );
    }
}

export default wrap (AddUserEmployer);

// EOF