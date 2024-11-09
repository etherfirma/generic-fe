import React, { Component } from "react";
import Breadcrumb from "../util/Breadcrumb";

class EditUserProfile extends Component {
    render() {
        const crumbs = [
            { label: null, href: "#/" },
            { label: "Edit Profile" },
        ];

        return (
            <div>
                <Breadcrumb crumbs={crumbs} />
                <h1>Edit User Profile </h1>

                Unimplemented
            </div>
        );
    }
}

export default EditUserProfile;

// EOF