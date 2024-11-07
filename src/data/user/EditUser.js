import React, { Component } from "react";
import Alert from "@mui/material/Alert";
import Breadcrumb from "../../util/Breadcrumb";

class EditUser extends Component {
    render () {
        return (
            <div>
                {this.renderHeader ()}
                <Alert severity="info">
                    Unimplemented
                </Alert>
            </div>
        );
    }

    renderHeader () {
        // const { thing } = this.store;
        const crumbs = [
            { label: null, href: "#/" },
            { label: "Users", href: "#/data/users" },
            { label: "Edit User" }
        ];
        return (
            <div>
                <Breadcrumb crumbs={crumbs} />
                {/*{super.renderHeader ()}*/}
                <h1>Edit User</h1>
            </div>
        );
    }
}

export default EditUser;

// EOF