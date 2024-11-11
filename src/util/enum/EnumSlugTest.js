import React, { Component } from "react";
import {observable} from "mobx";
import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import {PreJson, wrap} from "../Utils";
import _ from "lodash";
import {EnumSlug} from "./EnumSlug";
import "./EnumSlugs.css";

/**
 *
 */

class EnumSlugTest extends Component {
    store = observable ({
        value: "",
        enumType: "Colors",
    });

    render() {
        const { enumType, required, value } = this.store;
        const { EnumManager } = this.props;
        const { types } = EnumManager;

        const els = EnumManager.getType (enumType);
        const Slug = EnumSlug (enumType);

        return (
            <div>
                <h2>EnumSlugTest</h2>

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

                <br/><br/>

                <div>
                    {_.map (els, (el, i) => {
                        return (
                            <Slug value={el} />
                        );
                    })}
                </div>
            </div>
        );
    }
}

export default wrap (EnumSlugTest);

// EOF