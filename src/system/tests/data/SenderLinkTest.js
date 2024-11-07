import React, { Component } from "react";
import ErrorBanner from "../../../util/ErrorBanner";
import {PreJson, wrap} from "../../../util/Utils";
import {observable} from "mobx";
import SenderUtil, {senderLink} from "../../../data/sender/SenderUtil";
import Server from "../../../util/Server";
import Button from "@mui/material/Button";
import _ from "lodash";

/**
 *
 */

class SenderLinkTest extends Component {
    store = observable ({
        res: null
    });

    componentDidMount() {
        this.loadSenders ()
    }

    async loadSenders () {
        const query = SenderUtil.findSendersGql;
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
        const senders = this.store.res?.data?.findSenders?.results;

        return (
            <div>
                <h1>SenderLink Test</h1>

                <ErrorBanner error={this.store.res?.errors} />

                {senders && (
                    <ul>
                        {_.map(senders, (sender, i) => {
                            return (
                                <li>
                                    {senderLink (sender)}
                                </li>
                            );
                        })}
                    </ul>
                )}

                <Button size={"small"} variant={"outlined"} onClick={() => this.loadSenders()}>
                    Reload
                </Button>
            </div>
        );
    }
}

export default wrap(SenderLinkTest);

// EOF