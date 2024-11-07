import React, { Component } from 'react';
import {NO_SELECTION} from "./Utils";
import {observer} from "mobx-react";
import {FormControl, FormHelperText, InputLabel, MenuItem, Select} from "@mui/material";
import _ from "lodash";

class BooleanPicker extends Component {
    decodeValue (value) {
        if (value === NO_SELECTION) {
            return null;
        } else if (value === "true") {
            return true;
        } else {
            return false;
        }
    }

    encodeValue (value) {
        if (value === true) {
            return true;
        } else if (value === false) {
            return "false";
        } else {
            return NO_SELECTION;
        }
    }

    render () {
        const { value, onChange = () => null, label = "Boolean", formProps, hideEmpty } = this.props;

        let { error } = this.props;
        let { helperText } = this.props;

        if (! error) {
            if (! _.isBoolean (value)) {
                const { required } = this.props;
                if (required) {
                    error = true;
                    helperText = `A value is required.`;
                }
            }
        }

        return (
            <FormControl error={error} variant="outlined" {...formProps}>
                <InputLabel>{label}</InputLabel>
                <Select
                    value={this.encodeValue(value)}
                    onChange={(e) => {
                        onChange (this.decodeValue (e.target.value));
                    }}
                    label={label}
                    required
                >
                    {! hideEmpty && (
                        <MenuItem value={NO_SELECTION}>
                            <em>-- SELECT --</em>
                        </MenuItem>
                    )}
                    <MenuItem value={"true"}>True</MenuItem>
                    <MenuItem value={"false"}>False</MenuItem>
                </Select>
                {helperText && (
                    <FormHelperText>{helperText}</FormHelperText>
                )}
            </FormControl>
        );
    }
}

export default observer (BooleanPicker);

// EOF