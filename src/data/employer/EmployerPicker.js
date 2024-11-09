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

class EmployerPicker extends Component {
    store = observable ({
        employers: null,
        loading: false,
        error: null
    });

    componentDidMount() {
        this.reload ();
    }

    get query () {
        return `
            query ($req: EmployerFindRequest!) {
                res: findEmployers (req: $req) {
                    results { 
                        id 
                        key
                        name                        
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
            this.store.employers = null;
            const res = await Server._gql (this.query, this.variables);
            this.store.employers = res.results;
        }
        catch (e) {
            this.store.error = e;
        }
        finally {
            this.store.loading = false;
        }
    }

    getEmployer (employerId) {
        if (employerId) {
            const { employers } = this.store;
            return _.find (employers, (el) => el.id === employerId);
        }
        return null;
    }

    render () {
        const { value, onChange = () => null, label = "Employer", formProps, hideEmpty } = this.props;
        const { employers } = this.store;

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
                        const employer = decodeSelectValue (e.target.value);
                        onChange (employer);
                    }}
                    label={label}
                    required
                >
                    {! hideEmpty && (
                        <MenuItem value={NO_SELECTION}>
                            <em>-- SELECT --</em>
                        </MenuItem>
                    )}
                    {_.map (employers, (employer, i) => {
                        return (
                            <MenuItem key={i} value={employer}>
                                {employer.name} ({employer.key})
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

export default observer (EmployerPicker);

// EOF