import React, { Component } from "react";
import {doGql, PreJson, withCommas, wrap} from "../util/Utils";
import {observable} from "mobx";
import Validator from "../login/Validator";
import TextField from "@mui/material/TextField";
import {AddButton} from "../util/ButtonUtil";
import EnumPicker from "../util/enum/EnumPicker";
import ErrorBanner from "../util/ErrorBanner";
import Loading from "../util/Loading";
import Alert from "@mui/material/Alert";
import {batchLink} from "../data/thing/ThingUtil";

/**
 *
 */

const fields = [
    {
        path: "path",
        name: "Path",
        required: true,
        validator: Validator.pathValidator
    },
    {
        path: "feedType",
        name: "FeedType",
        required: true,
        validator: Validator.stringValidator
    },
];

const STATIC = {
    "localhost": {
        "APPYHERE": "/Users/crawford/Workspace/kotlin-server/cache/appyhere.xml",
        "HIRECLIX": "/Users/crawford/Workspace/kotlin-server/cache/hireclix.xml",
        "PARADOX": "/Users/crawford/Workspace/kotlin-server/cache/paradox.xml",
        "SMART_RECRUITER": "/Users/crawford/Workspace/kotlin-server/cache/smartrecruiters.xml",
        "REDDOT": "/Users/crawford/Workspace/kotlin-server/cache/reddot.xml"
    },
    "dev": {
        "APPYHERE": "/home/ubuntu/kotlin-server/cache/appyhere.xml",
        "HIRECLIX": "/home/ubuntu/kotlin-server/cache/hireclix.xml",
        "PARADOX": "/home/ubuntu/kotlin-server/cache/paradox.xml",
        "SMART_RECRUITER": "/home/ubuntu/kotlin-server/cache/smartrecruiters.xml",
        "REDDOT": "/home/ubuntu/kotlin-server/cache/reddot.xml"
    }
};

/**
 *
 */

class ImportFeed extends Component {
    store = observable ({
        path: "",
        feedType: "",
        errors: {},
        error: null,
        result: null,
        results: null,
        loading: false
    });

    validator = new Validator (this, fields);

    get isValid () {
        return this.validator.isValid;
    }

    validate () {
        this.validator.validate();
    }

    componentDidMount() {
        this.validate ();
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

    renderResults (results) {
        if (! results) {
            return null;
        } else {
            return (
                <div className={"ErrorBanner"}>
                    <Alert severity="info">
                        Import of type {results.importType} succeded, with {withCommas (results.jobCount)} jobs processed.
                        <ul>
                            <li>
                                <b>Batch</b> - {batchLink ({ importType: results.id })}
                            </li>
                            <li>
                                <b>Jobs Added</b> - {withCommas (results.jobsAdded)}
                            </li>
                            <li>
                                <b>Jobs Already Present</b> - {withCommas (results.jobsAlready)}
                            </li>
                            <li>
                                <b>Jobs Failed</b> - {withCommas (results.jobsFailed)}
                            </li>
                            <li>
                                <b>Malformed Entries</b> - {withCommas (results.malformed)}
                            </li>
                        </ul>
                    </Alert>
                </div>

            );
        }
    }

    render() {
        const { environment } = this.props;
        const {loading, errors} = this.store;
        const formProps = {
            fullWidth: true,
            size: "small"
        };

        return (
            <div>
                <h1>Import Feed</h1>

                <ErrorBanner error={this.store.error} />
                <Loading show={this.store.loading} />
                {this.renderResults (this.store.results?.data?.res)}

                <table className={"AddSenderTable"} >
                    <tbody>
                    <tr>
                        <td>
                            {this.textField ("path", "Path")}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <EnumPicker
                                enumType={"FeedType"}
                                value={this.store.feedType}
                                onChange={value => {
                                    this.store.feedType = value;
                                    if (value) {
                                        const paths = STATIC[environment.environment]
                                        if (paths) {
                                            this.store.path = paths [value];
                                        }
                                    }
                                    this.validate();
                                }}
                                required={true}
                                formProps={formProps}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={2}>
                            <AddButton disabled={loading || ! this.isValid} onClick={() => this.import ()} />
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        );
    }

    async import () {
        await doGql (this);
    }

    get query () {
        return `mutation ($feedType: String!, $path: String!) {
            res: importFeed (feedType: $feedType, path: $path) { 
                id
                jobCount
                jobsFailed
                jobsAlready
                jobsAdded
                malformed
                user { id name email } 
                importType
            }
        }`;
    }

    get variables () {
        const { feedType, path } = this.store;
        return { feedType, path };
    }
}

export default wrap (ImportFeed);

// EOF