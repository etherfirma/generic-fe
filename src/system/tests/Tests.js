import React, { Component } from "react";
import Breadcrumb from "../../util/Breadcrumb";

class Tests extends Component {
    static crumbs = [
        { label: null, href: "#/" },
        { label: "System", href: "#/system" },
        { label: "Tests" },
    ];

    render() {
        return (
            <div>
                <Breadcrumb crumbs={Tests.crumbs} />
                <h1>Tests</h1>

                <ul>
                    <li>
                        <a href={"#/tests/loading"}>
                            Loading
                        </a>
                    </li>
                    <li>
                        <a href={"#/tests/propertyTable"}>
                            PropertyTable
                        </a>
                    </li>
                    <li>
                        <a href={"#/tests/senderPicker"}>
                            SenderPicker
                        </a>
                    </li>
                    <li>
                        <a href={"#/tests/senderLink"}>
                            SenderLink
                        </a>
                    </li>
                    <li>
                        <a href={"#/tests/userPicker"}>
                            UserPicker
                        </a>
                    </li>
                    <li>
                        <a href={"#/tests/userLink"}>
                            UserLink
                        </a>
                    </li>
                    <li>
                        <a href={"#/tests/template"}>
                            TemplateTest
                        </a>
                    </li>
                    <li>
                        <a href={"#/tests/templatePicker"}>
                            TemplatePickerTest
                        </a>
                    </li>
                </ul>
            </div>
        );
    }
}

export default Tests;

// EOF