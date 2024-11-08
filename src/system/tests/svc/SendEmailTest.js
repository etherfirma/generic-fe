import React, { Component } from "react";
import {doGql, encodeUrl, getParams, PreJson, wrap} from "../../../util/Utils";
import _ from "lodash";
import {action, observable} from "mobx";
import TemplatePicker from "../../../data/template/TemplatePicker";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Loading from "../../../util/Loading";
import FancyBorder from "../../../util/FancyBorder";
import ErrorBanner from "../../../util/ErrorBanner";
import {IconButton, PrettifyButton, SendButton} from "../../../util/ButtonUtil";
import Validator from "../../../login/Validator";
import "./css/SendEmailTest.css";
import UserPicker from "../../../data/user/UserPicker";
import SenderPicker from "../../../data/sender/SenderPicker";


const fields = [
    {
        path: "template",
        name: "Template",
        required: true,
        validator: Validator.nonNullValidator
    },
    {
        path: "user",
        name: "User",
        required: true,
        validator: Validator.nonNullValidator
    },
    {
        path: "sender",
        name: "Sender",
        required: true,
        validator: Validator.nonNullValidator
    },
    {
        path: "subject",
        name: "Subject",
        required: true,
        validator: (val) => Validator.stringValidator (val, 5, 64)
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

class SendEmailTest extends Component {
    store = observable ({
        template: null,
        user: null,
        sender: null,
        subject: "", 
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
        const { template, sender, subject, user, context, loading, error, errors, result } = this.store;
        return (
            <div>
                <h1>SendEmail Test</h1>
                <ErrorBanner error={error} />

                <table className={"SendEmailTestTable"}>
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
                                        _.extend(context, JSON.parse(template.sampleContext));
                                        this.store.context = JSON.stringify(context, null, 2);
                                    }
                                    this.validate();
                                }}
                                required={true}
                                helperText={errors.template}
                                error={Boolean(errors.template)}
                                formProps={{
                                    fullWidth: true,
                                    size: "small"
                                }}
                            />
                        </td>
                        <td>
                            <TextField
                                label="Subject"
                                value={subject}
                                margin={"dense"}
                                size={"small"}
                                onChange={action ((e) => {
                                    this.store.subject = e.target.value;
                                    this.validate();
                                })}
                                fullWidth
                                helperText={errors.subject}
                                error={Boolean(errors.subject)}
                                variant="outlined"
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <SenderPicker
                                value={sender}
                                required={true}
                                onChange={action((sender) => {
                                    this.store.sender = sender;
                                    this.validate();
                                })}
                                formProps={{
                                    fullWidth: true,
                                    size: "small"
                                }}
                            />
                        </td>
                        <td>
                            <UserPicker
                                value={user?.id}
                                required={true}
                                onChange={action((user) => {
                                    this.store.user = user;
                                    this.validate();
                                })}
                                formProps={{
                                    fullWidth: true,
                                    size: "small"
                                }}
                            />
                        </td>
                    </tr>

                    <tr>
                        <td colSpan={2}>
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
                        <td colSpan={2}>
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
                                    this.validate();
                                }}
                                helperText={errors.context}
                                error={Boolean(errors.context)}
                                variant="outlined"
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <SendButton disabled={!this.isValid} onClick={() => this.doRender()} />
                        </td>
                    </tr>
                    </tbody>
                </table>

                <Loading show={loading}/>

                {this.renderResult(result)}
            </div>
        );
    }

    renderResult(result) {
        if (result) {
            return (
                <PreJson json={result} />
            )
        } else {
            return null;
        }
    }

    get query() {
        return `
            mutation ($req: EmailSendRequest!) { 
                res: sendEmail (req: $req) {
                    totalRejected
                    totalAccepted
                    id
                }
            }
        `;
    }

    get variables () {
        const { template, sender, subject, user, context } = this.store;

        return {
            req: {
                senderId: sender.id,
                userId: user.id,
                subject,
                htmlTemplateId: template.id,
                context: JSON.parse(context),
            }
        };
    }

    async doRender () {
        doGql (this);
    }
}

export default wrap (SendEmailTest);

// EOF