import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { decodeSelectValue, encodeSelectValue, NO_SELECTION } from '../Utils';
import {FormControl, FormHelperText, InputLabel, MenuItem, Select} from "@mui/material";
import EnumManager from "./EnumManager";

/**
 *
 */

class EnumPicker extends Component {
    constructor (enumType) {
        super ();
    }

    render () {
        if (! EnumManager.ready) {
            return EnumManager.status;
        }
        const { value, hideEmpty, onChange = () => null, disabled, formProps, multiple, enumType } = this.props;
        const label = this.props.label || enumType;

        let { error } = this.props;
        let { helperText } = this.props;

        if (! error) {
            if (! decodeSelectValue (value)) {
                const { required } = this.props;
                if (required) {
                    error = true;
                    helperText = `${enumType} is required.`;
                }
            }
        }

        return (
            <FormControl required error={error} variant={"outlined"} {...formProps}>
                <InputLabel id={`${enumType}-label`}>
                    {label}
                </InputLabel>
                <Select
                    multiple={multiple}
                    id={`${enumType}-picker`}
                    labelId={`${enumType}-label`}
                    label={label}
                    disabled={disabled}
                    value={encodeSelectValue (value)}
                    onChange={(e) => {
                        const value = decodeSelectValue (e.target.value);
                        onChange (value);
                    }}
                >
                    {! Boolean(hideEmpty) && (
                        <MenuItem value={NO_SELECTION}>
                            <em>{this.props.emptyLabel}</em>
                        </MenuItem>
                    )}
                    {EnumManager.getSelectItems (enumType, this.filter, this.props.renderer)}
                </Select>
                <FormHelperText>{helperText}</FormHelperText>
            </FormControl>
        );
    }
}

EnumPicker.propTypes = {
    hideEmpty: PropTypes.bool,
    multiple: PropTypes.bool,
    emptyLabel: PropTypes.string,
    enumType: PropTypes.string,
    label: PropTypes.string,
    value: PropTypes.string,
    error: PropTypes.string,
    onChange: PropTypes.func,
    renderer: PropTypes.func,
    // enumStore: PropTypes.object.isRequired,
};

EnumPicker.defaultProps = {
    emptyLabel: "-- SELECT --",
    multiple: false,
    hideEmpty: false,
};

export default EnumPicker;

// EOF