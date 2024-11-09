import React, { Component } from "react";
import {PreJson, wrap} from "../../../util/Utils";
import _ from "lodash";
import {observable} from "mobx";
import { action } from "mobx";
import EmployerPicker from "../../../data/employer/EmployerPicker";
import Breadcrumb from "../../../util/Breadcrumb";

/**
 *
 */

class EmployerPickerTest extends Component {
    store = observable ({
        employer: null,
        employer2: null
    });

    static crumbs = [
        { label: null, href: "#/" },
        { label: "System", href: "#/system" },
        { label: "Tests", href: "#/tests" },
        { label: "EmployerPicker Test" },
    ];

    set Employer (val) {
        action (() => this.store.employer = val) ();
    }

    render () {
        const { employer, employer2 } = this.store;

        return (
            <div>
                <Breadcrumb crumbs={EmployerPickerTest.crumbs} />
                <h1>Employer Picker Test</h1>

                <EmployerPicker
                    value={employer}
                    required={false}
                    onChange={employer => this.store.employer = employer}
                    formProps={{
                        fullWidth: true,
                        size: "small"
                    }}
                />

                <PreJson json={employer} />
                <br/>

                <EmployerPicker
                    value={employer2}
                    required={true}
                    onChange={employer => this.store.employer2 = employer}
                    formProps={{
                        fullWidth: true,
                        size: "small"
                    }}
                />

                <PreJson json={employer2} />
            </div>
        );
    }
}

export default wrap (EmployerPickerTest);

// EOF