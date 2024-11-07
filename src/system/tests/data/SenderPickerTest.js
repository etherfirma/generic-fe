import React, { Component } from "react";
import {PreJson, wrap} from "../../../util/Utils";
import _ from "lodash";
import {observable} from "mobx";
import { action } from "mobx";
import SenderPicker from "../../../data/sender/SenderPicker";
import Breadcrumb from "../../../util/Breadcrumb";

/**
 *
 */

class SenderPickerTest extends Component {
    store = observable ({
        sender: null,
        sender2: null
    });

    static crumbs = [
        { label: null, href: "#/" },
        { label: "System", href: "#/system" },
        { label: "Tests", href: "#/tests" },
        { label: "SenderPicker Test" },
    ];

    set Sender (val) {
        action (() => this.store.sender = val) ();
    }

    render () {
        const { sender, sender2 } = this.store;

        return (
            <div>
                <Breadcrumb crumbs={SenderPickerTest.crumbs} />
                <h1>Sender Picker Test</h1>

                <SenderPicker
                    value={sender}
                    required={false}
                    onChange={sender => this.store.sender = sender}
                    formProps={{
                        fullWidth: true,
                        size: "small"
                    }}
                />

                <PreJson json={sender} />
                <br/>

                <SenderPicker
                    value={sender2}
                    required={true}
                    onChange={sender => this.store.sender2 = sender}
                    formProps={{
                        fullWidth: true,
                        size: "small"
                    }}
                />

                <PreJson json={sender2} />
            </div>
        );
    }
}

export default wrap (SenderPickerTest);

// EOF