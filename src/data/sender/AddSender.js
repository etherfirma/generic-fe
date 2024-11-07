import React from 'react';
import {wrap} from "../../util/Utils";
import AddThing from "../thing/AddThing";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Breadcrumb from "../../util/Breadcrumb";
import "./css/AddSender.css";
import Validator from "../../login/Validator";
import {AddButton} from "../../util/ButtonUtil";

/**
 * The validation rules for the form fields.
 */

const fields = [
    {
        path: "email",
        name: "Email Address",
        required: true,
        validator: Validator.emailValidator
    },
    {
        path: "name",
        name: "Name",
        required: true,
        validator: Validator.stringValidator
    },
    {
        path: "name",
        name: "Name",
        required: false,
        validator: Validator.stringValidator
    }
];

class AddSender extends AddThing {
    constructor () {
        super({
            header: "Add Sender",
            slug: "sender",
            name: "",
            email: "",
            label: ""
        });
        this.validate ();
    }

    validator = new Validator (this, fields);

    get query () {
        return `
            mutation ($sender: SenderInput!) {
                res: addSender (sender: $sender) { 
                    id
                } 
            }`
    }

    get variables () {
        const { name, label, email } = this.store;
        return {
            sender: {
                label,
                name: name || null,
                email
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
        const { name, email, label } = this.store;
        const { loading, errors } = this.store;

        return (
            <div>
                <table className={"AddSenderTable"} >
                    <tbody>
                    <tr>
                        <td>
                            {this.textField ("label", "Label")}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            {this.textField ("name", "Name")}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            {this.textField ("email", "Email")}
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
        window.location.hash = `#/data/sender/${obj}`;
    }

    renderHeader () {
        const { thing } = this.store;
        const crumbs = [
            { label: null, href: "#/" },
            { label: "Senders", href: "#/data/senders" },
            { label: "Add Sender" }
        ];
        return (
            <div>
                <Breadcrumb crumbs={crumbs} />
                {super.renderHeader ()}
            </div>
        );
    }
}

export default wrap (AddSender);

// EOF