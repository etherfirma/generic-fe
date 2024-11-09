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

class GeoPicker extends Component {
    store = observable ({
        geos: null,
        loading: false,
        error: null
    });

    componentDidMount() {
        this.reload ();
    }

    get query () {
        return `
            query ($req: GeoFindRequest!) {
                res: findGeos (req: $req) {
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
            this.store.geos = null;
            const res = await Server._gql (this.query, this.variables);
            this.store.geos = res.results;
        }
        catch (e) {
            this.store.error = e;
        }
        finally {
            this.store.loading = false;
        }
    }

    getGeo (geoId) {
        if (geoId) {
            const { geos } = this.store;
            return _.find (geos, (el) => el.id === geoId);
        }
        return null;
    }

    render () {
        const { value, onChange = () => null, label = "Geo", formProps, hideEmpty } = this.props;
        const { geos } = this.store;

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
                        const geo = decodeSelectValue (e.target.value);
                        onChange (geo);
                    }}
                    label={label}
                    required
                >
                    {! hideEmpty && (
                        <MenuItem value={NO_SELECTION}>
                            <em>-- SELECT --</em>
                        </MenuItem>
                    )}
                    {_.map (geos, (geo, i) => {
                        return (
                            <MenuItem key={i} value={geo}>
                                {geo.name} ({geo.key})
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

export default observer (GeoPicker);

// EOF