import React, { Component } from "react";
import {decodeSelectValue, encodeSelectValue, NO_SELECTION, PreJson, wrap} from "../../util/Utils";
import _ from "lodash";
import {observable} from "mobx";
import EnumPicker from "./EnumPicker";
// import ColorPicker from "./ColorPicker";
import {FormControl, FormHelperText, InputLabel, MenuItem, Select} from "@mui/material";
import BooleanPicker from "../BooleanPicker";

/**
 *
 */

class EnumPickerTest extends Component {
    store = observable ({
        value: "",
        enumType: "Colors",
        required: false,
    });

    render () {
        const { enumType, required, value } = this.store;
        const { EnumManager } = this.props;
        const { types } = EnumManager;

        const formProps = {
            fullWidth: true,
            size: "small"
        };

        return (
            <div>
                <h1>EnumPicker Test</h1>

                <FormControl required variant={"outlined"} fullWidth={true} size={"small"}>
                    <InputLabel>
                        EnumType
                    </InputLabel>
                    <Select
                        label={"EnumType"}
                        value={enumType}
                        onChange={(e) => {
                            this.store.enumType = e.target.value;
                            this.store.value = "";
                        }}
                    >
                        {_.map(types, (type, i) => {
                            return (
                                <MenuItem value={type}>
                                    {type}
                                </MenuItem>
                            );
                        })}
                    </Select>
                </FormControl>

                <br/>
                <br/>

                <BooleanPicker
                    value={required}
                    onChange={(required) => {
                        this.store.required = required;
                    }}
                    required={true}
                    formProps={formProps}
                />

                <br/><br/>

                <EnumPicker
                    enumType={enumType}
                    value={value}
                    onChange={value => this.store.value = value}
                    required={required}
                    formProps={formProps}
                />

                <PreJson json={value} />
            </div>
        );
    }
}

export default wrap (EnumPickerTest);

// EOF