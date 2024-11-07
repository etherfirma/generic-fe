import React from 'react';
import {wrap} from "../../util/Utils";
// import "./css/AddTemplate.css";
import AddThing from "../thing/AddThing";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import ValidationUtil from "../../util/ValidationUtil";
import Breadcrumb from "../../util/Breadcrumb";
import _ from "lodash";
import "./css/AddTemplate.css";
import Validator from "../../login/Validator";
import UserPicker from "../user/UserPicker";
import {action} from "mobx";

/**
 * The validation rules for the form fields.
 */

const fields = [
    {
        path: "template",
        name: "Template",
        required: true,
        validator: Validator.stringValidator
    },
    {
        path: "path",
        name: "Path",
        required: true,
        validator: Validator.stringValidator
    },
    {
        path: "engine",
        name: "Engine",
        required: true,
        validator: Validator.stringValidator
    },
    {
        path: "sampleContext",
        name: "Sample Context",
        required: true,
        validator: Validator.jsonObjectValidator
    },
    {
        path: "user",
        name: "User",
        required: true,
        validator: Validator.nonNullValidator
    }
];

/**
 *
 */

class AddTemplate extends AddThing {
    constructor () {
        super ({
            header: "Add Template",
            slug: "template",
            description: "",
            template: "",
            sampleContext: "{}",
            engine: "FREEMARKER",
            user: null,
            path: ""
        });
        this.validate ();
    }

    validator = new Validator (this, fields);

    componentDidMount() {
        this.validate ();
    }

    get query () {
        return `
            mutation ($template: TemplateInput!) {
                res: addTemplate (template: $template) { 
                    id
                } 
            }`
    }

    get variables () {
        const { description, template, user, engine, path, sampleContext } = this.store;
        return {
            template: {
                engine,
                template,
                sampleContext,
                description,
                path,
                userId: user.id
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
        const { engine, user, path, description, sampleContext, template } = this.store;
        const { loading, errors } = this.store;

        return (
            <div>
                <table className={"AddTemplateTable"} >
                    <tbody>
                    <tr>
                        <td>
                            {this.textField ("path", "Path")}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <UserPicker
                                value={user?.id}
                                required={true}
                                onChange={action ((user) => this.store.user = user)}
                                formProps={{
                                    fullWidth: true,
                                    size: "small"
                                }}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            {this.textField ("description", "Description")}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            {this.textField ("engine", "Engine", { disabled: true })}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <TextField
                                label="Template"
                                value={template}
                                margin={"dense"}
                                size={"small"}
                                fullWidth
                                multiline={true}
                                rows={12}
                                onChange={(e) => {
                                    this.store.template = e.target.value;
                                    this.validate ();
                                }}
                                helperText={errors.template}
                                error={Boolean (errors.template)}
                                variant="outlined"
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <TextField
                                label="SampleContext"
                                value={sampleContext}
                                margin={"dense"}
                                size={"small"}
                                fullWidth
                                multiline={true}
                                rows={6}
                                onChange={(e) => {
                                    this.store.sampleContext = e.target.value;
                                    this.validate ();
                                }}
                                helperText={errors.sampleContext}
                                error={Boolean (errors.sampleContext)}
                                variant="outlined"
                            />
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={2}>
                            <Button variant="outlined" size="small" disabled={loading || ! this.isValid} onClick={() => this.doAdd ()}>
                                <i className="fal fa-plus"></i>
                                &nbsp;
                                Add
                            </Button>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        );
    }
    onSuccess (obj) {
        window.location.hash = `#/data/template/${obj}`;
    }

    renderHeader () {
        const { thing } = this.store;
        const crumbs = [
            { label: null, href: "#/" },
            { label: "Templates", href: "#/data/templates" },
            { label: "Add Template" }
        ];
        return (
            <div>
                <Breadcrumb crumbs={crumbs} />
                {super.renderHeader ()}
            </div>
        );
    }
}

export default wrap (AddTemplate);

// EOF