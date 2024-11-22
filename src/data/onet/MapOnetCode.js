import React, { Component } from "react";
import {observable} from "mobx";
import {doGql, PreJson, wrap} from "../../util/Utils";
import ErrorBanner from "../../util/ErrorBanner";
import Loading from "../../util/Loading";
import {SearchButton} from "../../util/ButtonUtil";
import Validator from "../../login/Validator";
import TextField from "@mui/material/TextField";
import PropertyTable from "../../util/PropertyTable";

const fields = [
    {
        path: "title",
        name: "Title",
        required: true,
        validator: Validator.stringValidator ()
    },
];

class MapOnetCode extends Component {
    constructor () {
        super ();
        Validator.addValidator (this, fields);
    }

    store = observable ({
        title: "",
        results: null,
        result: null,
        errors: {},
        error: null,
        loading: false
    });

    componentDidMount() {
        this.validate ();
    }

    render () {
        const {error, loading, results, title, errors, result } = this.store;

        return (
            <div>
                <h1>Find OnetCode</h1>

                <ErrorBanner error={error} />
                <Loading show={loading} />

                <TextField
                    label={"Title"}
                    value={title}
                    margin={"dense"}
                    size={"small"}
                    fullWidth
                    onChange={(e) => {
                        this.store.title = e.target.value;
                        this.validate ();
                    }}
                    helperText={errors.title}
                    error={Boolean(errors.title)}
                    variant="outlined"
                />
                <SearchButton disabled={! this.isValid ()} onClick={() => doGql (this)} />
                <br/><br/>
                {this.renderResult (result)}
            </div>
        );
    }

    renderResult (result) {
        if (!result) {
            return null;
        }
        const o = {
            id: result.id,
            code: result.code,
            title: (
                <a href={`#/data/onetCode/${result.id}`}>
                    {result.title}
                </a>
            )
        };
        return (
            <div>
                <PropertyTable value={o}/>
            </div>
        );
    }


    get query () {
        return `query ($title: String!) {
            res: getOnetCodeForTitle (title: $title) {
                id code title
            } 
        }`;
    }

    get variables () {
        const { title } = this.store;
        return { title };
    }
}

export default wrap (MapOnetCode);

// EOF