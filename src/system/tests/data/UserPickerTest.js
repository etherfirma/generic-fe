import React, { Component } from "react";
import {PreJson, wrap} from "../../../util/Utils";
import _ from "lodash";
import {observable} from "mobx";
import { action } from "mobx";
import UserPicker from "../../../data/user/UserPicker";

/**
 *
 */

class UserPickerTest extends Component {
    store = observable ({
        user: null,
        user2: null
    });

    render () {
        const { user, user2 } = this.store;

        return (
            <div>
                <h1>User Picker Test</h1>

                <UserPicker
                    value={user?.id}
                    required={false}
                    onChange={action ((user) => this.store.user = user)}
                    formProps={{
                        fullWidth: true,
                        size: "small"
                    }}
                />

                <PreJson json={user} />
                <br/>

                <UserPicker
                    value={user2?.id}
                    required={true}
                    onChange={action ((user) => this.store.user2 = user)}
                    formProps={{
                        fullWidth: true,
                        size: "small"
                    }}
                />

                <PreJson json={user2} />
            </div>
        );
    }
}

export default wrap (UserPickerTest);

// EOF