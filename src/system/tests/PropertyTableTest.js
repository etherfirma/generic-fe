import React, { Component } from "react";
import PropertyTable from "../../util/PropertyTable";
import YesNo from "../../util/YesNo";
import Breadcrumb from "../../util/Breadcrumb";

class PropertyTableTest extends Component {
    static crumbs = [
        { label: null, href: "#/" },
        { label: "System", href: "#/system" },
        { label: "Tests", href: "#/tests" },
        { label: "PropertyTable Test" },
    ];

    render() {
        const props = {
          name: "Lee Crawford",
          color: "green",
          active: <YesNo value={true} />,
          date: new Date ().toString ()
        };

        return (
            <div>
                <Breadcrumb crumbs={PropertyTableTest.crumbs}/>
                <h1>PropertyTableTest</h1>

                <PropertyTable value={props}/>
            </div>
        );
    }
}

export default PropertyTableTest;

// EOF