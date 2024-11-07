import React, { Component } from "react";
import {decodeSelectValue, encodeSelectValue, NO_SELECTION, wrap} from "../../util/Utils";
import _ from "lodash";
import {observable} from "mobx";
import Server from "../../util/Server";
import {FormControl, FormHelperText, InputLabel, MenuItem, Select} from "@mui/material";
import { action } from "mobx";

/**
 *
 */

class UserPicker extends Component {
    store = observable ({
        users: null,
        error: null,
        loading: null
    });

    setter = (which, val) => {
        action (() => this.store[which] = val) ();
    };

    set users (val) {
        this.setter ("users", val);
    }
    set loading (val) {
        this.setter ("loading", val);
    }
    set error (val) {
        this.setter ("error", val);
    }

    componentDidMount() {
        this.reload ();
    }

    async reload () {
        try {
            this.loading = true;
            this.error = null;
            this.users = null;
            const res = await Server._gql (this.query, this.variables);
        this.users = res.results;
        }
        catch (e) {
            this.error = e;
        }
        finally {
            this.loading = false;
        }
    }

    get query () {
        return `
            query ($req: UserFindRequest!) {
                res: findUsers (req: $req) {
                    results { 
                        id 
                        name
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


    render () {
        const { value, onChange = () => null, label = "User", disabled, formProps, hideEmpty } = this.props;
        const { users } = this.store;

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
                    value={encodeSelectValue (value)}
                    onChange={(e) => {
                        const id = e.target.value;
                        const decoded = _.find (users, user => user.id === id) || null;
                        onChange (decoded);
                    }}
                    label={label}
                    disabled={disabled}
                    required
                >
                    {! hideEmpty && (
                        <MenuItem value={NO_SELECTION}>
                            <em>-- SELECT --</em>
                        </MenuItem>
                    )}
                    {_.map (users, (user, i) => {
                        return (
                            <MenuItem key={i} value={user.id}>
                                {user.name} &lt;{user.email}&gt;
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

UserPicker.defaultProps = {
    disabled: false,
    hideEmpty: false
};

export default wrap (UserPicker);

// EOF