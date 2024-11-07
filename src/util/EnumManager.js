import {action, observable} from "mobx";
import Server from './Server';
import {objGet} from "./Utils";
import _ from "lodash";
import React from "react";
import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";

/**
 * A store that downloads all of the enumerated types from the server for
 * local use in pickers, etc.
 */

class EnumManager {
    store = observable ({
        enums: null,
        error: null,
        initialized: false,
        loading: false
    });

    get ready () {
        return this.store.initialized && !this.store.loading && !this.store.error;
    }
    get status () {
        if (this.initialized) {
            return "Not initialized.";
        } else if (this.loading) {
            return "Loading";
        } else if (this.error) {
            return "Errors loading enums: " + this.error;
        } else {
            return "Ready."
        }
    }
    get initialized () {
        return this.store.initialized;
    }
    get loading () {
        return this.store.loading;
    }
    get error () {
        return this.store.error;
    }
    get enums () {
        return this.store.enums;
    }

    get types () {
        return this.enums ? Object.keys (this.enums) : []
    }

    getType (type) {
        return this.enums[type];
    }

    async initialize () {
        if (this.loading || this.initialized) {
            return;
        }
        try {
            this.store.loading = true;
            const query = `query { res: getEnums { type values } }`;
            const res = await Server._gql (query);
            this.store.enums = this.rewrite (res) ;
        }
        catch (e) {
            this.store.error = e;
        }
        finally {
            this.store.initialized = true;
            this.store.loading = false;
        }
    }

    rewrite (obj) {
        const tmp= {};
        _.each (obj, el => tmp[el.type] = el.values);
        return tmp;
    }

    getSelectItems (type, filter, renderer) {
        let values = this.getType (type);

        if (values) {
            if (filter) {
                values = _.filter (values, filter);
            }
            return _.map (values, (value, i) => {
                return (
                    <MenuItem value={value} key={i}>
                        {renderer ? renderer (value) : value}
                    </MenuItem>
                );
            });
        } else {
            return null;
        }
    }

    getSelect (type, value, onChange, fcProps, sProps) {
        const values = this.getType (type);
        return (
            <FormControl {...fcProps}>
                <InputLabel id={`${type}-select-label`}>
                    {type}
                </InputLabel>
                <Select
                    {...sProps}
                    labelId={`${type}-select-label`}
                    id={`${type}-select`}
                    value={value}
                    onChange={onChange}
                >
                    <MenuItem value={""}>- SELECT -</MenuItem>
                    {_.map (values, (value, i) => <MenuItem value={value} key={i}>{value}</MenuItem>)}
                </Select>
            </FormControl>
        );
    }

}

const inst = new EnumManager ();
inst.initialize ();

export default inst;

// EOF