import React from 'react';
import {encodeUrl, formatDate, objGet, TabPanel, wrap, PreJson} from "../../util/Utils";
import PropertyTable from "../../util/PropertyTable";
import ID from "../../util/ID";
import ThingDetail from "../thing/ThingDetail";
import Button from "@mui/material/Button";
import UserUtil, {userLink} from "./UserUtil";
import YesNo from "../../util/YesNo";
import Breadcrumb from "../../util/Breadcrumb";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Server from "../../util/Server";
import {DeleteButton, EditButton, ReloadButton} from "../../util/ButtonUtil";

/**
 *
 */

class DataUser extends ThingDetail {
    constructor () {
        super ({
            type: "User",
            tab: 0
        });
    }

    get query () {
        return `
        query ($id: String!) {
            res: userById (id: $id) {
                id
                name
                email
                locked
                props 
                userLocal {
                    hashedPassword 
                    reset {
                        expires
                        isExpired
                        token 
                    } 
                    props
                } 
            } 
        }`;
    }

    actions (user) {
        return (
            <div>
                <EditButton onClick={() => {
                    window.location.hash = `#/data/user/${user.id}/edit`;
                }} />
                &nbsp;
                <DeleteButton onClick={()=> {
                    const { infoDialogStore } = this.props;
                    infoDialogStore.showDialog ({
                        title: "Unable",
                        body: "User deletion is not supported."
                    });
                }}/>
                &nbsp;
                <ReloadButton onClick={() => this.doLoad ()} />
            </div>
        );
    }

    /**
     * Request a new email verification email be sent.
     *
     * @param user
     */

    // async sendVerifyEmail (user) {
    //     try {
    //         const mutation = `
    //             mutation ($email: String!) {
    //                 res: sendVerifyEmail (email: $email)
    //             }
    //         `;
    //         const variables = {
    //             email: user.email
    //         };
    //         const res = await Server._gql (mutation, variables);
    //         const {snackbarStore} = this.props;
    //         snackbarStore.show("Verification email sent.");
    //     }
    //     catch (e) {
    //         const { infoDialogStore } = this.props;
    //         infoDialogStore.showError (e);
    //     }
    //     return
    // }

    /**
     *
     * @param userId
     */

    doRender (user) {
        console.log ("doRender", user);
        if (! user) {
            return (
                <span>
                    User not found.
                </span>
            );
        }

        const publicUrl = UserUtil.getPublicUrl (user);
        const o = {
            id: <ID value={user.id} snackbar={true} />,
            user: userLink (user),
            name: user.name,
            locked: <YesNo value={user.locked} labelled={true} />,
            created: user.props.created,
            lastModified: user.props.lastModified,
        };

        formatDate (o, [ "created", "lastModified" ]);
        return (
            <div>
                <PropertyTable value={o} size={"small"} />
                <br/>
                {this.actions (user)}
                <br/>
                {this.showAuthentication (user)}
            </div>
        )
    }

    showAuthentication (user) {
        const { tab } = this.store;

        return (
            <div>
                <Tabs value={tab} onChange={(e, nt) => this.store.tab = nt}>
                    <Tab label={<p><i className="fal fa-key" />&nbsp;Local</p>} />
                </Tabs>
                <TabPanel value={tab} index={0}>
                    {this.showLocal (user)}
                </TabPanel>
            </div>
        )
    }

    showLocal (user) {
        const { userLocal } = user;
        if (userLocal) {
            const props = {
                hashedPassword: userLocal.hashedPassword,
                created: userLocal.props.created,
                lastModified: userLocal.props.lastModified,
                reset: <i>none</i>,
            };
            if (userLocal.reset) {
                props.reset = userLocal.reset.token;
                props.expires = userLocal.reset.expires;
                props.isExpired = <YesNo value={userLocal.reset.isExpired} labelled={true} />;
            }
            formatDate (props, [ "created", "lastModified", "expires" ]);
            return (
                <div>
                    <PropertyTable value={props} />
                    <br/>
                    <Button variant={"outlined"} size={"small"} onClick={() => this.resetPassword (user)}>
                        Reset Password
                    </Button>
                </div>
            );
        } else {
            return "NONE";
        }
    }

    renderHeader () {
        const { result, id } = this.store;
        const crumbs = [
            { label: null, href: "#/" },
            { label: "Users", href: "#/data/users" },
            { label: result?.email || id }
        ];
        return (
            <div>
                <Breadcrumb crumbs={crumbs} />
                {super.renderHeader ()}
            </div>
        );
    }

    async resetPassword (user) {
        const mutation = `
            mutation ($email: String!) { 
                res: forgotPassword (email: $email)          
            }
        `;
        const variables = { email: user.email };
        try {
            const res = await Server._gql(mutation, variables);
            const { snackbarStore } = this.props;
            snackbarStore.show ("Forgot password email sent.");
        }
        catch (e) {
            const { infoDialogStore } = this.props;
            infoDialogStore.showDialog (e);
        }
    }
}

export default wrap (DataUser);

// EOF