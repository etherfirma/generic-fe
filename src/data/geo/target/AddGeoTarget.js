import React from 'react';
import {wrap} from "../../../util/Utils";
import AddThing from "../../thing/AddThing";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Breadcrumb from "../../../util/Breadcrumb";
import "./css/AddGeoTarget.css";
import Validator from "../../../login/Validator";
import {AddButton} from "../../../util/ButtonUtil";
import GeoPicker from "../GeoPicker";
import BooleanPicker from "../../../util/BooleanPicker";

/**
 * The validation rules for the form fields.
 */

const fields = [
    {
        path: "geo",
        name: "Geo",
        required: true,
        validator: Validator.nonNullValidator
    },
    {
        path: "url",
        name: "Url",
        required: true,
        validator: Validator.urlValidator
    },
];

class AddGeoTarget extends AddThing {
    constructor () {
        super({
            header: "Add GeoTarget",
            slug: "geoTarget",
            geo: null,
            url: "",
            isActive: false
        });
        this.validate ();
    }

    validator = new Validator (this, fields);

    get query () {
        return `
            mutation ($geoTarget: GeoTargetInput!) {
                res: addGeoTarget (geoTarget: $geoTarget) { 
                    id
                } 
            }`
    }

    get variables () {
        const { geo, url, isActive } = this.store;
        return {
            geoTarget: {
                geoId: geo.id,
                url,
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
        const { geo, url, isActive } = this.store;
        const { loading, errors } = this.store;

        return (
            <div>
                <table className={"AddGeoTargetTable"} >
                    <tbody>
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
                        <td>
                            {this.textField ("url", "Url")}
                        </td>
                    </tr>
                    <tr>
                        <td>
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
                        </td>
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
        window.location.hash = `#/data/geoTarget/${obj}`;
    }

    renderHeader () {
        const { thing } = this.store;
        const crumbs = [
            { label: null, href: "#/" },
            { label: "GeoTargets", href: "#/data/geoTargets" },
            { label: "Add GeoTarget" }
        ];
        return (
            <div>
                <Breadcrumb crumbs={crumbs} />
                {super.renderHeader ()}
            </div>
        );
    }
}

export default wrap (AddGeoTarget);

// EOF