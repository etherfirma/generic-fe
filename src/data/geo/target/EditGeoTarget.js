import React, { Component } from "react";
import {doGql, PreJson, wrap} from "../../../util/Utils";
import {observable} from "mobx";
import {matchPath} from "react-router-dom";
import TextField from "@mui/material/TextField";
import Loading from "../../../util/Loading";
import Server from "../../../util/Server";
import "./css/EditGeoTarget.css";
import ErrorBanner from "../../../util/ErrorBanner";
import Validator from "../../../login/Validator";
import {CancelButton, UpdateButton} from "../../../util/ButtonUtil";
import GeoPicker from "../GeoPicker";
import BooleanPicker from "../../../util/BooleanPicker";

/**
 * The validation rules for the formR fields.
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

/**
 *
 */

class EditGeoTarget extends Component {
    store = observable({
        geoTarget: null,
        errors: {},
        error: null,
        results: null,
        loading: false
    });

    validator = new Validator (this, fields, (obj) => obj.store.geoTarget);

    get isValid () {
        return this.validator.isValid;
    }

    validate () {
        this.validator.validate();
    }

    componentDidMount() {
        this.store.id = this.params.id;
        this.loadGeoTarget ();
    }

    get query () {
        return `
            query ($id: String!) {
                res: geoTargetById (id: $id) {
                    id
                    geo { id name key } 
                    url
                    isActive
                } 
            }
        `;
    }

    get variables () {
        const { id } = this.store;
        return { id };
    }

    async loadGeoTarget () {
        this.store.geoTarget = await doGql (this);
        this.validate ();
    }

    get params() {
        const match = matchPath({path: "/data/geoTarget/:id/edit"}, window.location.hash.substring(1));
        return match?.params;
    }

    textField(which, label, extra) {
        const {geoTarget, errors} = this.store;
        return (
            <TextField
                {...extra}
                label={label}
                value={geoTarget[which]}
                margin={"dense"}
                size={"small"}
                fullWidth
                onChange={(e) => {
                    geoTarget[which] = e.target.value;
                    this.validate();
                }}
                helperText={errors[which]}
                error={Boolean(errors[which])}
                variant="outlined"
            />
        );
    }

    render() {
        const { loading, error, geoTarget} = this.store;

        return (
            <div>
                <h1>Edit GeoTarget</h1>
                <ErrorBanner error={error} />
                <Loading show={loading} />
                {geoTarget && this.renderForm (geoTarget)}
            </div>
        );
    }

    renderForm (geoTarget) {
        const {  errors, loading } = this.store;

        return (
            <div>
                <table className={"EditGeoTargetTable"} >
                    <tbody>
                    <tr>
                        <td>
                            {this.textField ("id", "ID", { disabled: true })}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <GeoPicker
                                value={geoTarget.geo.id}
                                onChange={geo => {
                                    geoTarget.geo = geo;
                                    this.validate ();
                                }}
                                disabled={true}
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
                                value={geoTarget.isActive}
                                onChange={(boolean) => {
                                    this.store.geoTarget.isActive = boolean;
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
                            <UpdateButton disabled={loading || ! this.isValid} onClick={() => this.doUpdate ()} />
                            &nbsp;
                            <CancelButton onClick={() => this.doCancel ()} />
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        );
    }

    doCancel () {
        const { geoTarget } = this.store;
        window.location.href = `#/data/geoTarget/${geoTarget.id}`;
        return;
    }

    async doUpdate () {
        const { geoTarget: obj } = this.store;
        const { id, url, isActive } = obj;
        const mutation = `
            mutation ($id: String!, $update: GeoTargetUpdate!) {
                res: updateGeoTarget (id: $id, update: $update) {
                    id
                }              
            }
        `;
        const variables = {
            id,
            update: {
                url, isActive
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

export default wrap (EditGeoTarget);

// EOF