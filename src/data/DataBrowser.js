import React, { Component } from "react";
import Breadcrumb from "../util/Breadcrumb";
import _ from "lodash";

class DataBrowser extends Component {
    crumbs = [
        { label: null, href: "#/" },
        { label: "Data Browser" },
    ];

    dataTypes = [
        { name: "user", hash: "#/data/users" },
        { name: "userLocal", hash: "#/data/userLocals" },
        { name: "sender", hash: "#/data/senders" },
        { name: "template", hash: "#/data/templates" },
    ];

    render() {
        return (
            <div>
                <Breadcrumb crumbs={this.crumbs} />
                <h1>DataBrowser</h1>

                <ul>
                    {_.map (this.dataTypes, (dataType, i) => {
                        return (
                            <li key={i}>
                                <a onClick={() => window.location.hash = dataType.hash}>
                                    {dataType.name}
                                </a>
                            </li>
                        )
                    })}
                </ul>
            </div>
        );
    }
}

export default DataBrowser;

// EOF