import React, { Component } from "react";
import Loading from "../../../util/Loading";
import {Breadcrumbs} from "@mui/material";

class LoadingTest extends Component {
    static crumbs = [
        { label: null, href: "#/" },
        { label: "System", href: "#/system" },
        { label: "Tests", href: "#/tests" },
        { label: "Loading Test Test" },
    ];

    render() {
        return (
            <div>
                <Breadcrumbs crumbs={LoadingTest.crumbs} />
                <h1>LoadingTest</h1>

                <Loading show={true} />
            </div>
        );
    }
}

export default LoadingTest;

// EOF