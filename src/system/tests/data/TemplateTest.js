import React, { Component } from "react";
import {doGql, encodeUrl, getParams, PreJson, wrap} from "../../../util/Utils";
import _ from "lodash";
import {observable} from "mobx";
import TemplatePicker from "../../../data/template/TemplatePicker";
import TextField from "@mui/material/TextField";
import "../../../data/template/css/TemplateTest.css";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Loading from "../../../util/Loading";
import FancyBorder from "../../../util/FancyBorder";
import ErrorBanner from "../../../util/ErrorBanner";
import {IconButton, PrettifyButton} from "../../../util/ButtonUtil";
import Validator from "../../../login/Validator";


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

class TemplateTest extends Component {
    store = observable ({
        template: null,
        context: "{}",
        errors: {},
        loading: false,
        error: null
    });

    validator = new Validator (this, fields);

    get isValid () {
        return this.validator.isValid;
    }

    validate () {
        this.validator.validate();
    }

    componentDidMount() {
        const { templateId } = getParams ();
        if (templateId) {
            this.store.template = {
                id: templateId
            }
        }
        this.validate ();
    }

    render () {
        const { template, context, loading, error, errors, result } = this.store;
        return (
            <div>
                <h1>Template Test</h1>
                <ErrorBanner error={error} />

                <table className={"TemplateTestTable"}>
                    <tbody>
                    <tr>
                        <td>
                            <TemplatePicker
                                value={template?.id}
                                onChange={(template) => {
                                    this.store.template = template;
                                    if (template) {
                                        const context = {
                                            ROOT: window.location.origin
                                        };
                                        _.extend (context, JSON.parse (template.sampleContext));
                                        this.store.context = JSON.stringify (context, null, 2);
                                    }
                                    this.validate();
                                }}
                                required={true}
                                helperText={errors.template}
                                error={Boolean (errors.template)}
                                formProps={{
                                    fullWidth: true,
                                    size: "small"
                                }}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <TextField
                                label="Template"
                                value={template?.template || ""}
                                margin={"dense"}
                                size={"small"}
                                rows={8}
                                multiline={true}
                                fullWidth
                                readOnly={true}
                                variant="outlined"
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <TextField
                                label="Context"
                                value={context}
                                margin={"dense"}
                                size={"small"}
                                rows={8}
                                multiline={true}
                                fullWidth
                                onChange={(e) => {
                                    this.store.context = e.target.value;
                                    this.validate ();
                                }}
                                helperText={errors.context}
                                error={Boolean (errors.context)}
                                variant="outlined"
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <Button variant="outlined" size="small" disabled={! this.isValid} onClick={() => this.doRender ()}>
                                <i className="fal fa-newspaper"></i>
                                &nbsp;
                                Render
                            </Button>
                            &nbsp;
                            <PrettifyButton disabled={this.store.errors.context} onClick={() => {
                                this.store.context = JSON.stringify (JSON.parse (this.store.context), null, 2);
                            }} />
                            &nbsp;
                            <IconButton icon={"fal fa-brackets-curly"} label={"GraphQL"} onClick={() => {
                                const params = {
                                    query: this.query,
                                    variables: JSON.stringify (this.variables)
                                };
                                window.location.hash = encodeUrl ("#/system/gql", params);;
                            }}/>
                        </td>
                    </tr>
                    </tbody>
                </table>

                <Loading show={loading} />

                {this.renderResult (result)}
            </div>
        );
    }

    renderResult (result) {
        if (result) {
            const html = { __html: result };
            return (
                <FancyBorder label={"Merged"} style={{ marginTop: 16 }}>
                    <div dangerouslySetInnerHTML={html} />
                </FancyBorder>
            )
        } else {
            return null;
        }
    }

    get query () {
        return `
            query ($id: String!, $context: Any!) { 
                res: mergeTemplate (id: $id, context: $context)
            }
        `;
    }

    get variables () {
        const { template, context } = this.store;
        return {
            id: template.id,
            context: JSON.parse (context)
        };
    }

    async doRender () {
        doGql (this);
    }
}

export default wrap (TemplateTest);

// EOF