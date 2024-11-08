import React, { Component } from "react";
import ErrorBanner from "../../../util/ErrorBanner";
import {PreJson, wrap} from "../../../util/Utils";
import {observable} from "mobx";
import UserUtil from "../../../data/user/UserUtil";
import Server from "../../../util/Server";
import Button from "@mui/material/Button";
import _ from "lodash";
import {userLink} from "../../../data/thing/ThingUtil";

/**
 *
 */

class UserLinkTest extends Component {
    store = observable ({
        res: null
    });

    componentDidMount() {
        this.loadUsers ()
    }

    async loadUsers () {
        const query = UserUtil.findUsersGql;
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
        const users = this.store.res?.data?.findUsers?.results;

        return (
            <div>
                <h1>UserLink Test</h1>

                <ErrorBanner error={this.store.res?.errors} />

                {users && (
                    <ul>
                        {_.map(users, (user, i) => {
                            return (
                                <li>
                                    {userLink (user)}
                                </li>
                            );
                        })}
                    </ul>
                )}

                <Button size={"small"} variant={"outlined"} onClick={() => this.loadUsers()}>
                    Reload
                </Button>
            </div>
        );
    }
}

export default wrap(UserLinkTest);

// EOF