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

class TemplatePicker extends Component {
    store = observable ({
        templates: null,
        loading: false,
        error: null
    });

    componentDidMount() {
        this.reload ();
    }

    get query () {
        return `
            query ($req: TemplateFindRequest!) {
                res: findTemplates (req: $req) {
                    results { 
                        id 
                        description
                        sampleContext
                        path
                        template
                        user { 
                            name
                        }
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
            this.store.templates = null;
            const res = await Server._gql (this.query, this.variables);
            this.store.templates = res.results;
        }
        catch (e) {
            this.store.error = e;
        }
        finally {
            this.store.loading = false;
        }
    }

    getTemplate (templateId) {
        if (templateId) {
            const { templates } = this.store;
            return _.find (templates, (el) => el.id == templateId);
        }
        return null;
    }

    render () {
        const { value, onChange = () => null, label = "Template", formProps, hideEmpty } = this.props;
        const { templates } = this.store;

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
                        const templateId = decodeSelectValue (e.target.value);
                        const template = _.find (this.store.templates, (el) => el.id == templateId);
                        onChange (template);
                    }}
                    label={label}
                    required
                >
                    {! hideEmpty && (
                        <MenuItem value={NO_SELECTION}>
                            <em>-- SELECT --</em>
                        </MenuItem>
                    )}
                    {_.map (templates, (template, i) => {
                        return (
                            <MenuItem key={i} value={template.id}>
                                {template.path} ({template.user.name})
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

export default observer (TemplatePicker);

// EOF