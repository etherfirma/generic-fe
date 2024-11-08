import React, { Component } from "react";
import {PreJson, wrap} from "../../../util/Utils";
import _ from "lodash";
import {observable} from "mobx";
import BooleanPicker from "../../../util/BooleanPicker";

/**
 *
 */

class BooleanPickerTest extends Component {
    store = observable ({
        boolean1: null,
        boolean2: null
    });

    render () {
        const { boolean1, boolean2 } = this.store;
        return (
            <div>
                <h1>Boolean Test</h1>

                <BooleanPicker
                    value={boolean1}
                    onChange={(boolean) => {
                        this.store.boolean1 = boolean;
                    }}
                    required={false}
                    formProps={{
                        fullWidth: true,
                        size: "small"
                    }}
                />

                <PreJson json={boolean1} />
                <br/>

                <BooleanPicker
                    value={boolean2}
                    onChange={(boolean) => {
                        this.store.boolean2 = boolean;
                    }}
                    required={true}
                    formProps={{
                        fullWidth: true,
                        size: "small"
                    }}
                />

                <PreJson json={boolean2} />
            </div>
        );
    }
}

export default wrap (BooleanPickerTest);

// EOF