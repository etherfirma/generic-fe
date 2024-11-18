import React, { Component } from "react";
import {doGql, getParams, TabPanel, wrap} from "../../../util/Utils";
import {observable} from "mobx";
import {IconButton} from "../../../util/ButtonUtil";
import Validator from "../../../login/Validator";
import ErrorBanner from "../../../util/ErrorBanner";
import TextField from "@mui/material/TextField";
import "./css/TemplateMerge.css";
import FancyBorder from "../../../util/FancyBorder";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

const fields = [
    {
        path: "template",
        name: "Template",
        required: true,
        validator: Validator.stringValidator
    },
    {
        path: "context",
        name: "Context",
        required: true,
        validator: Validator.jsonObjectValidator
    }
];

/**
 *
 */

class TemplateMerge extends Component {
    store = observable ({
        results: null,
        result: null,
        loading: false,
        error: null,
        errors: {},
        template: "",
        context: "{}",
        tab: 0
    });

    validator = new Validator (this, fields);

    get isValid () {
        return this.validator.isValid;
    }

    validate () {
        this.validator.validate();
    }

    componentDidMount() {
        const { template, context } = getParams ();
        if (template) {
            this.store.template = template;
        }
        if (context) {
            this.store.context = context;
        }
        this.validate ();
    }

    render() {
        const { template, context, error, errors, tab } = this.store;

        const formProps = {
            margin: "dense",
            size: "small",
            variant: "outlined",
            fullWidth: true
        };

        return (
            <div>
                <h1>Template Merge</h1>
                <ErrorBanner error={error} />


                <Tabs
                    value={tab}
                    indicatorColor="primary"
                    textColor="primary"
                    onChange={(e, f) => this.store.tab = f}
                >
                    <Tab label="Template"/>
                    <Tab label="Context"/>
                </Tabs>
                <TabPanel value={tab} index={0}>
                    <TextField
                        label="Template"
                        value={template}
                        rows={24}
                        onChange={(e) => {
                            this.store.template = e.target.value;
                            this.validate ();
                        }}
                        multiline={true}
                        {...formProps}
                    />
                </TabPanel>
                <TabPanel value={tab} index={1}>
                    <TextField
                        label="Context"
                        value={context}
                        rows={24}
                        multiline={true}
                        onChange={(e) => {
                            this.store.context = e.target.value;
                            this.validate();
                        }}
                        helperText={errors.context}
                        error={Boolean(errors.context)}
                        {...formProps}
                    />
                </TabPanel>

                <table className={"TemplateMergeTable"}>
                    <tfoot>
                    <tr>
                        <IconButton icon={"far fa-file-alt"} label={"Merge"} onClick={() => {
                            doGql (this)
                        }}/>
                    </tr>
                    </tfoot>
                </table>
                {this.renderResults()}
            </div>
        );
    }

    renderResults() {
        const {result} = this.store;
        if (result == null) {
            return null;
        }
        return (
            <div>
                <FancyBorder label={"Merged"} style={{ marginTop: 16 }}>
                    <div dangerouslySetInnerHTML={{ __html: result }} />
                </FancyBorder>
            </div>
        );
    }

    get query() {
        return `query ($template: String!, $context: Any!) {
            res: mergeRaw (template: $template, context: $context) 
        }`;
    }

    get variables() {
        const { template, context } = this.store;
        return {
            template,
            context: JSON.parse (context)
        };
    }
}

export default wrap(TemplateMerge);

// EOF