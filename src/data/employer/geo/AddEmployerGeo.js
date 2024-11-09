import React from 'react';
import {wrap} from "../../../util/Utils";
import AddThing from "../../thing/AddThing";
import TextField from "@mui/material/TextField";
import Breadcrumb from "../../../util/Breadcrumb";
import "./css/AddEmployerGeo.css";
import Validator from "../../../login/Validator";
import {AddButton} from "../../../util/ButtonUtil";
import BooleanPicker from "../../../util/BooleanPicker";
import EmployerPicker from "../EmployerPicker";
import GeoPicker from "../../geo/GeoPicker";

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
        path: "geo",
        name: "Geo",
        required: true,
        validator: Validator.nonNullValidator
    }
];

class AddEmployerGeo extends AddThing {
    constructor () {
        super({
            header: "Add EmployerGeo",
            slug: "employerGeo",
            employerGeo: null,
            geo: null,
            isActive: false
        });
        this.validate ();
    }

    validator = new Validator (this, fields);

    get query () {
        return `
            mutation ($employerGeo: EmployerGeoInput!) {
                res: addEmployerGeo (employerGeo: $employerGeo) { 
                    id
                } 
            }`
    }

    get variables () {
        const { employer, geo, isActive } = this.store;
        return {
            employerGeo: {
                employerId: employer.id,
                geoId: geo.id,
                isActive
            }
        };
    }

    doRender () {
        const { employer, geo, isActive } = this.store;
        const { loading, errors } = this.store;

        return (
            <div>
                <table className={"AddEmployerGeoTable"} >
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
                                value={geo}
                                onChange={geo => {
                                    this.store.geo = geo;
                                    this.validate ();
                                }}
                                required={true}
                                formProps={{
                                    fullWidth: true,
                                    size: "small"
                                }}
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
                            required={true}
                            formProps={{
                                fullWidth: true,
                                size: "small"
                            }}
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
        window.location.hash = `#/data/employerGeo/${obj}`;
    }

    renderHeader() {
        const {thing} = this.store;
        const crumbs = [
            {label: null, href: "#/"},
            {label: "EmployerGeos", href: "#/data/employerGeos" },
            { label: "Add EmployerGeo" }
        ];
        return (
            <div>
                <Breadcrumb crumbs={crumbs} />
                {super.renderHeader ()}
            </div>
        );
    }
}

export default wrap (AddEmployerGeo);

// EOF