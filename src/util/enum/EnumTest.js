import React, { Component } from "react";
import {PreJson, wrap} from "../../util/Utils";
import _ from "lodash";
import {observable, toJS} from "mobx";
import YesNo from "../YesNo";
import PropertyTable from "../PropertyTable";
import {TabPanel} from "../Utils";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";


/**
 *
 */

class EnumTest extends Component {
    store = observable ({
        tab: 0
    });

    render () {
        const { tab } = this.store;
        const { EnumManager } = this.props;

        const props = {
            loading: <YesNo value={EnumManager.loading} />,
            error: <YesNo value={EnumManager.error} />,
            initialized: <YesNo value={EnumManager.initialized} />
        };

        const handleChange = (even, newValue) => {
            this.store.tab = newValue;
        };

        return (
            <div>
                <h1>EnumTest</h1>

                <PropertyTable value={props} />

                <div>
                    <Tabs value={tab} onChange={handleChange} >
                        <Tab label="Enums" />
                        <Tab label="Raw" />
                    </Tabs>
                    <TabPanel value={tab} index={0}>
                        {_.map (EnumManager.types, (type, i) => {
                            const els = EnumManager.getType (type);
                            return (
                                <div key={i}>
                                    <h2>{type}</h2>
                                    <ul>
                                        {_.map (els, (val, j) => {
                                            return (
                                                <li key={j}>
                                                    {val}
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            );
                        })}
                    </TabPanel>
                    <TabPanel value={tab} index={1}>
                        <PreJson json={EnumManager.enums} />
                    </TabPanel>
                </div>
            </div>
        );
    }
}

export default wrap (EnumTest);

// EOF