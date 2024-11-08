import React, { Component } from "react";
import ErrorBanner from "../../../util/ErrorBanner";
import {PreJson, wrap} from "../../../util/Utils";
import {observable} from "mobx";
import TemplateUtil from "../../../data/template/TemplateUtil";
import Server from "../../../util/Server";
import Button from "@mui/material/Button";
import _ from "lodash";
import {templateLink} from "../../../data/thing/ThingUtil";

/**
 *
 */

class TemplateLinkTest extends Component {
    store = observable ({
        res: null
    });

    componentDidMount() {
        this.loadTemplates ()
    }

    async loadTemplates () {
        const query = TemplateUtil.findTemplatesGql;
        const variables = { req: { filters: { } } };
        try {
            this.store.res = await Server.gql(query, variables);;
        }
        catch (e) {
            console.error (e);
            this.store.res = null;
        }
    }

    render() {
        const templates = this.store.res?.data?.findTemplates?.results;

        return (
            <div>
                <h1>TemplateLink Test</h1>

                <ErrorBanner error={this.store.res?.errors} />

                {templates && (
                    <ul>
                        {_.map(templates, (template, i) => {
                            return (
                                <li>
                                    {templateLink (template)}
                                </li>
                            );
                        })}
                    </ul>
                )}

                <Button size={"small"} variant={"outlined"} onClick={() => this.loadTemplates()}>
                    Reload
                </Button>
            </div>
        );
    }
}

export default wrap(TemplateLinkTest);

// EOF