import React, { Component } from "react";
import "./css/StringListEditor.css";
import {observable} from "mobx";
import {PreJson, wrap} from "../../util/Utils";
import FancyBorder from "../../util/FancyBorder";
import {AddButton} from "../../util/ButtonUtil";
import TextField from "@mui/material/TextField";
import _ from "lodash";
import {InputAdornment} from "@mui/material";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

/**
 *
 */

class StringListEditor extends Component {
    store = observable ({
        d: 1
    });

    render() {
        const { label, values, setValues } = this.props;
        return (
            <FancyBorder label={label}>
                {_.map (values, (value, i) => {
                    return (
                        <div className={"StringListEditorRow"}>
                            <TextField
                                label={i + 1}
                                value={value}
                                margin={"dense"}
                                // size={"small"}
                                fullWidth
                                onChange={(e) => {
                                    values[i] = e.target.value;
                                }}
                                // helperText={errors[which]}
                                // error={Boolean (errors[which])}
                                variant="outlined"
                            />
                            <div>
                                <DeleteForeverIcon onClick={() => {
                                    const copy = values.slice ();
                                    copy.splice (i, 1);
                                    setValues (copy);
                                }}/>
                            </div>
                        </div>
                    );
                })}
                <AddButton label="Add Entry" onClick={() => {
                    const copy = values.slice ();
                    copy.push ("");
                    setValues (copy);
                }} />
            </FancyBorder>
        );
    }
}

export default wrap (StringListEditor);

// EOF