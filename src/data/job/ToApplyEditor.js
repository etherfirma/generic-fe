import React, { Component } from "react";
import {observable} from "mobx";
import { wrap } from "../../util/Utils";
import FancyBorder from "../../util/FancyBorder";
import TextField from "@mui/material/TextField";

/**
 *
 */

class ToApplyEditor extends Component {
    store = observable ({
        d: 1
    });


    render() {
        const { label, value, setValue} = this.props;

        const formProps = {
            margin: "dense",
            fullWidth: true,
            variant: "outlined"
        };

        return (
            <FancyBorder label={label}>
                <TextField
                    {...formProps}
                    label={"URL"}
                    value={value.url}
                    onChange={(e) => {
                        value.url = e.target.value;
                    }}
                    // helperText={errors[which]}
                    // error={Boolean (errors[which])}
                />
                <TextField
                    {...formProps}
                    label={"Instructions"}
                    value={value.instructions}
                    onChange={(e) => {
                        value.instructions = e.target.value;
                    }}
                    // helperText={errors[which]}
                    // error={Boolean (errors[which])}
                />

                <TextField
                    {...formProps}
                    label={"Contact Information"}
                    value={value.contact}
                    onChange={(e) => {
                        value.contact = e.target.value;
                    }}
                    // helperText={errors[which]}
                    // error={Boolean (errors[which])}
                />

            </FancyBorder>
        );
    }
}

export default wrap (ToApplyEditor);

// EOF