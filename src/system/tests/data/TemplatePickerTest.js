import React, { Component } from "react";
import {PreJson, wrap} from "../../../util/Utils";
import _ from "lodash";
import {observable} from "mobx";
import SenderPicker from "../../../data/sender/SenderPicker";
import TemplatePicker from "../../../data/template/TemplatePicker";

/**
 *
 */

class TemplatePickerTest extends Component {
    store = observable ({
        template: null,
        template2: null
    });

    render () {
        const { template, template2 } = this.store;
        return (
            <div>
                <h1>Template Test</h1>

                <TemplatePicker
                    value={template?.id}
                    onChange={(template) => {
                        this.store.template = template;
                    }}
                    required={false}
                    formProps={{
                        fullWidth: true,
                        size: "small"
                    }}
                />

                <PreJson json={template} />
                <br/>

                <TemplatePicker
                    value={template2?.id}
                    onChange={(template) => {
                        this.store.template2 = template;
                    }}
                    required={true}
                    formProps={{
                        fullWidth: true,
                        size: "small"
                    }}
                />

                <PreJson json={template2} />
            </div>
        );
    }
}

export default wrap (TemplatePickerTest);

// EOF