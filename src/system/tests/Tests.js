import React, { Component } from "react";
import Breadcrumb from "../../util/Breadcrumb";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import {TabPanel, wrap} from "../../util/Utils";
import {observable} from "mobx";

/**
 *
 */

class Tests extends Component {
    static crumbs = [
        { label: null, href: "#/" },
        { label: "System", href: "#/system" },
        { label: "Tests" },
    ];

    store = observable ({
        tab: 0
    });

    render() {
        const { tab } = this.store;

        return (
            <div>
                <Breadcrumb crumbs={Tests.crumbs} />
                <h1>Tests</h1>

                <Tabs value={tab} onChange={(e, nt) => this.store.tab = nt}>
                    <Tab label={"UX"} />
                    <Tab label={"Data"} />
                    <Tab label={"System"} />
                </Tabs>
                <TabPanel value={tab} index={0}>
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
                    </ul>
                </TabPanel>
                <TabPanel value={tab} index={1}>
                    <ul>
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
                            <a href={"#/tests/templatePicker"}>
                                TemplatePickerTest
                            </a>
                        </li>
                    </ul>
                </TabPanel>
            <TabPanel value={tab} index={2}>
                <ul>
                    <li>
                        <a href={"#/tests/template"}>
                            TemplateTest
                        </a>
                    </li>
                </ul>
            </TabPanel>
            </div>
        );
    }
}

export default wrap(Tests);

// EOF