import React from 'react';
import {wrap} from "../../util/Utils";
import AddThing from "../thing/AddThing";
import TextField from "@mui/material/TextField";
import Breadcrumb from "../../util/Breadcrumb";
import BooleanPicker from "../../util/BooleanPicker";
import Validator from "../../login/Validator";
import "./css/AddUser.css";
import {AddButton} from "../../util/ButtonUtil";
import EnumPicker from "../../util/enum/EnumPicker";

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
    },
    {
        path: "type",
        name: "Type",
        required: false,
        validator: Validator.stringValidator
    }
];

/**
 *
 */

class AddUser extends AddThing {
    constructor () {
        super ({
            header: "Add User",
            name: "",
            slug: "user",
            email: "",
            type: "USER",
            locked: true
        });
        this.validate ();
    }

    validator = new Validator (this, fields);

    get query () {
        return `
            mutation ($user: UserInput!) {
                res: addUser (user: $user) { 
                    id
                } 
            }`
    }

    get variables () {
        const { name, email, locked, type } = this.store;
        return {
            user: {
                name,
                email,
                locked,
                type
            }
        };
    }

    doRender () {
        const { name, email, locked, type } = this.store;
        const { loading, errors } = this.store;

        const formProps = { fullWidth: true, size: "small" };

        return (
            <div>
                <table className={"AddUserTable"}>
                    <tbody>
                    <tr>
                        <td colSpan={2}>
                            <TextField
                                label="Name"
                                value={name}
                                margin={"dense"}
                                size={"small"}
                                fullWidth
                                onChange={(e) => {
                                    this.store.name = e.target.value;
                                    this.validate ();
                                }}
                                helperText={errors.name}
                                error={Boolean (errors.name)}
                                variant="outlined"
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <TextField
                                label="Email"
                                value={email}
                                margin={"dense"}
                                size={"small"}
                                fullWidth
                                onChange={(e) => {
                                    this.store.email = e.target.value;
                                    this.validate ();
                                }}
                                helperText={errors.email}
                                error={Boolean (errors.email)}
                                variant="outlined"
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <BooleanPicker
                                value={locked}
                                label={"Locked"}
                                onChange={value => this.store.locked = value}
                                formProps={formProps}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <EnumPicker
                                enumType={"UserType"}
                                value={type}
                                onChange={value => this.store.type = value}
                                required={true}
                                formProps={formProps}
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
        window.location.hash = `#/data/user/${obj}`;
    }

    renderHeader () {
        const crumbs = [
            { label: null, href: "#/" },
            { label: "Users", href: "#/data/users" },
            { label: "Add User" }
        ];
        return (
            <div>
                <Breadcrumb crumbs={crumbs} />
                {super.renderHeader ()}
            </div>
        );
    }
}

export default wrap (AddUser);

// EOF