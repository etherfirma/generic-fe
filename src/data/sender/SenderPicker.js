import React, { Component } from 'react';
import {decodeSelectValue, encodeSelectValue, NO_SELECTION} from "../../util/Utils";
import {observer} from "mobx-react";
import {FormControl, FormHelperText, InputLabel, MenuItem, Select} from "@mui/material";
import {observable} from "mobx";
import Server from "../../util/Server";
import _ from "lodash";

/**
 *
 */

class SenderPicker extends Component {
    store = observable ({
        senders: null,
        loading: false,
        error: null
    });

    componentDidMount() {
        this.reload ();
    }

    get query () {
        return `
            query ($req: SenderFindRequest!) {
                res: findSenders (req: $req) {
                    results { 
                        id 
                        label
                        email
                    } 
                }        
            }
        `;
    }

    get variables () {
        return {
            req: {
                skip: 0, limit: -1, filters: { }
            }
        };
    }

    async reload () {
        try {
            this.store.loading = true;
            this.store.error = null;
            this.store.senders = null;
            const res = await Server._gql (this.query, this.variables);
            this.store.senders = res.results;
        }
        catch (e) {
            this.store.error = e;
        }
        finally {
            this.store.loading = false;
        }
    }

    render () {
        const { value, onChange = () => null, label = "Sender", formProps, hideEmpty } = this.props;
        const { senders } = this.store;

        let { error } = this.props;
        let { helperText } = this.props;

        if (! error) {
            if (! value) {
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
                    value={encodeSelectValue(value)}
                    onChange={(e) => {
                        onChange (decodeSelectValue (e.target.value));
                    }}
                    label={label}
                    required
                >
                    {! hideEmpty && (
                        <MenuItem value={NO_SELECTION}>
                            <em>-- SELECT --</em>
                        </MenuItem>
                    )}
                    {_.map (senders, (sender, i) => {
                        console.log (sender)
                        return (
                            <MenuItem key={i} value={sender}>
                                {sender.label} &lt;{sender.email}&gt;
                            </MenuItem>
                        );
                    })}
                </Select>
                {helperText && (
                    <FormHelperText>{helperText}</FormHelperText>
                )}
            </FormControl>
        );
    }
}

export default observer (SenderPicker);

// EOF