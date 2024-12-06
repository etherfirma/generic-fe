import React, { Component } from "react";
import { wrap } from "../../../util/Utils";
import Validator from "../../../login/Validator";
import TextField from "@mui/material/TextField";
import BooleanPicker from "../../../util/BooleanPicker";
import EnumPicker from "../../../util/enum/EnumPicker";
import {AddButton} from "../../../util/ButtonUtil";
import Breadcrumb from "../../../util/Breadcrumb";
import AddThing from "../../thing/AddThing";


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
        path: "locked",
        name: "Locked",
        required: false,
        validator: null
    },
    {
        path: "type",
        name: "Type",
        required: true,
        validator: Validator.stringValidator
    },
    {
        path: "password",
        name: "Password",
        required: true,
        validator: Validator.stringValidator
    }
];


class AddUserLocal extends AddThing {
    constructor () {
        super ({
            header: "Add UserLocal",
            slug: "user",
            name: "",
            email: "",
            password: "",
            type: "USER",
            locked: true
        });
        this.validate ();
    }

    validator = new Validator (this, fields);

    get query () {
        return `
            mutation ($userLocal: UserLocalInput!) {
                res: addUserLocal (userLocal: $userLocal) { 
                    id
                } 
            }`
    }

    get variables () {
        const { name, password, email, locked, type } = this.store;
        return {
            userLocal: {
                name,
                email,
                password,
                locked,
                type
            }
        };
    }

    doRender () {
        const { name, email, password, locked, type } = this.store;
        const { loading, errors } = this.store;

        const formProps = { fullWidth: true, size: "small", margin: "dense", variant: "outlined" };

        return (
            <div>
                <table className={"AddUserTable"}>
                    <tbody>
                    <tr>
                        <td colSpan={2}>
                            <TextField
                                label="Name"
                                value={name}
                                onChange={(e) => {
                                    this.store.name = e.target.value;
                                    this.validate();
                                }}
                                helperText={errors.name}
                                error={Boolean(errors.name)}
                                {...formProps}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <TextField
                                label="Email"
                                value={email}
                                onChange={(e) => {
                                    this.store.email = e.target.value;
                                    this.validate();
                                }}
                                helperText={errors.email}
                                error={Boolean(errors.email)}
                                {...formProps}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <TextField
                                label="Password"
                                value={password}
                                onChange={(e) => {
                                    this.store.password = e.target.value;
                                    this.validate();
                                }}
                                helperText={errors.password}
                                error={Boolean(errors.password)}
                                {...formProps}
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
                            <AddButton disabled={loading || !this.isValid} onClick={() => this.doAdd()}/>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        );
    }

    onSuccess(obj) {
        window.location.hash = `#/data/userLocal/${obj}`;
    }

    renderHeader() {
        const crumbs = [
            {label: null, href: "#/"},
            {label: "UserLocals", href: "#/data/userLocals"},
            {label: "Add UserLocal"}
        ];
        return (
            <div>
                <Breadcrumb crumbs={crumbs}/>
                {super.renderHeader()}
            </div>
        );
    }
}

export default wrap(AddUserLocal);

// EOF