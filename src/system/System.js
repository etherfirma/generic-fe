import React, { Component } from "react";
import Breadcrumb from "../util/Breadcrumb";

class System extends Component {
    crumbs = [
        { label: null, href: "#/" },
        { label: "System" },
    ];

    render() {
        return (
            <div>
                <Breadcrumb crumbs={this.crumbs} />
                <h1>System</h1>

                <ul>
                    <li>
                        <a href={"#/system/gql"}>
                            GraphQL
                        </a>
                    </li>
                    <li>
                        <a href={"#/tests"}>
                            Tests
                        </a>
                    </li>
                    <li>
                        <a href={"#/system/cardinality"}>
                            Cardinality
                        </a>
                    </li>
                    <li>
                        <a href={"#/system/importFeed"}>
                            Import Feed
                        </a>
                    </li>
                </ul>
            </div>
        );
    }
}

export default System;

// EOF