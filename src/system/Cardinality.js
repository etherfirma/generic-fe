import React, { Component } from "react";
import Breadcrumb from "../util/Breadcrumb";

class Cardinality extends Component {
    static crumbs = [
        { label: null, href: "#/" },
        { label: "System", href: "#/system" },
        { label: "Cardinality" }
    ];

    render() {
        return (
            <div>
                <Breadcrumb crumbs={Cardinality.crumbs} />
                <h1>Cardinality</h1>

                Unimplemented
            </div>
        );
    }
}

export default Cardinality;

// EOF