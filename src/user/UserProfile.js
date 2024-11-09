import React, { Component } from "react";
import Breadcrumb from "../util/Breadcrumb";
import {matchPath} from "react-router";
import {observable} from "mobx";
import {doGql, If, PreJson, wrap} from "../util/Utils";
import "./css/UserProfile.css";
import {EditButton} from "../util/ButtonUtil";
import AuthManager from "../util/AuthManager";

/**
 *
 */

class UserProfile extends Component {
    store = observable ({
        id: null,
        loading: false,
        result: null,
        elapsed: null,
        autoLoad: true,
    });

    componentDidMount() {
        const params = this.getParams ();
        const id = params.id;
        if (id) {
            this.store.id = id;
            doGql (this);
        }
        return;
    }

    getParams () {
        const match = matchPath({ path: "/profile/:id" }, window.location.hash.substring (1));
        return match?.params;
    }

    render() {
        const { id, result } = this.store;
        const crumbs = [
            { label: null, href: "#/" },
            { label: "User Profile", href: "" },
            { label: result?.name || id }
        ];

        return (
            <div>
                <Breadcrumb crumbs={crumbs} />

                {result
                    ? this.renderUser (result)
                    : "User not found"
                }
            </div>
        );
    }

    renderUser (user) {
        const isMe = user.id === AuthManager.user.id;

        return (
            <div>
                <table className={"UserProfileTable"}>
                    <tbody>
                    <tr>
                        <td>
                            <img height={200}
                                 src={"https://cdn.iconscout.com/icon/free/png-512/free-avatar-icon-download-in-svg-png-gif-file-formats--user-boy-avatars-flat-icons-pack-people-456322.png?f=webp&w=256"}/>
                        </td>
                        <td>
                            <div className={"UserProfile-name"}>{user.name}</div>
                            <div className={"UserProfile-email"}>{user.email}</div>

                        </td>
                    </tr>
                    </tbody>
                </table>

                <br/>
                <If condition={isMe}>
                    <EditButton onClick={() => window.location.hash = "#/profile/edit"} />
                </If>
            </div>
        );
    }

    get query() {
        return `query ($id: String!) { 
            res: userById (id: $id) {
                id
                name
                email 
            }  
        }`;
    }

    get variables() {
        const {id} = this.store;
        return {id};
    }
}

export default wrap(UserProfile);

// EOF