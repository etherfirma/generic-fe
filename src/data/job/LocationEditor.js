import React, { Component } from "react";
import {observable} from "mobx";
import { wrap } from "../../util/Utils";
import FancyBorder from "../../util/FancyBorder";
import TextField from "@mui/material/TextField";

/**
 *
 */

class LocationEditor extends Component {
    store = observable ({
        d: 1
    });

    render() {
        const { label, value, setValue } = this.props;

        const formProps = {
            margin: "dense",
            fullWidth: true,
            variant: "outlined"
        };

        return (
            <FancyBorder label={label}>
                <TextField
                    {...formProps}
                    label={"City"}
                    value={value.city}
                    onChange={(e) => {
                        value.city = e.target.value;
                    }}
                    // helperText={errors[which]}
                    // error={Boolean (errors[which])}
                />
                <TextField
                    {...formProps}
                    label={"Additional"}
                    value={value.additional}
                    onChange={(e) => {
                        value.additional = e.target.value;
                    }}
                    // helperText={errors[which]}
                    // error={Boolean (errors[which])}
                />
            </FancyBorder>
        );
    }
}

export default wrap (LocationEditor);

// EOF