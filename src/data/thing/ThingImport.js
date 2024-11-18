import React, { Component } from "react";
import {doGql, PreJson, wrap} from "../../util/Utils";
import _ from "lodash";
import {observable} from "mobx";
import Button from "@mui/material/Button";
import "./css/ThingImport.css";
import Server from "../../util/Server";
import Loading from "../../util/Loading";
import ErrorBanner from "../../util/ErrorBanner";
import {UploadButton} from "../../util/ButtonUtil";

/**
 * A base class for generating pages that import data via upload.
 */

class ThingImport extends Component {
    store = observable ({
        files: null,
        errors: {},
        error: null,
        label: "???",
        loading: false
    });

    constructor (label) {
        super();
        this.store.label = label;
    }

    componentDidMount() {
        this.validate ();
    }

    validate () {
        const errors = {};
        if (! this.store.files) {
            errors.files = "File must be specified.";
        }
        this.store.errors = errors;
    }

    get isValid () {
        return Object.keys(this.store.errors).length === 0;
    }

    render () {
        const { errors, error, loading } = this.store;

        return (
            <div>
                <h1>Import {this.store.label}s</h1>
                <ErrorBanner error={error} />
                <Loading show={loading} />

                <div className={"ThingImportFiles"}>
                    <input
                        id="fileupload"
                        name="myfile"
                        type="file"
                        onChange={(e) => {
                            this.store.files = e.target.files;
                            this.validate();
                        }}
                    />
                    {errors.files && (
                        <div className={"ThingImportError"}>
                            {errors.files}
                        </div>
                    )}
                </div>
                <br/>
                {this.actions ()}
            </div>
        );
    }

    actions () {
        const { loading } = this.store;
        return (
            <>
                <UploadButton disabled={!this.isValid || loading} onClick={() => {
                    this.doUpload();
                }}/>
            </>
        );
    }

    get variables () {
        return {
            file: "@file"
        };
    }

    get files () {
        return this.store.files;
    }

    async doUpload () {
        const res = await doGql (this);
        const { snackbarStore } = this.props;
        snackbarStore.show (`Added ${res} ${this.store.label.toLowerCase()}s.`);
    }
}

export default ThingImport;

// EOF