import React from 'react';
import {encodeUrl, formatDate, objGet, TabPanel, wrap, PreJson} from "../../util/Utils";
import PropertyTable from "../../util/PropertyTable";
import ID from "../../util/ID";
import ThingDetail from "../thing/ThingDetail";
import UserUtil from "./UserUtil";
import YesNo from "../../util/YesNo";
import Breadcrumb from "../../util/Breadcrumb";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Server from "../../util/Server";
import {DeleteButton, EditButton, ReloadButton, ResetButton, SendButton} from "../../util/ButtonUtil";
import {userLink} from "../thing/ThingUtil";

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
                created
                lastModified
                name
                email
                locked
                emailVerified
                emailVerification {
                    expires
                    isExpired
                    token 
                } 
                userLocal {
                    hashedPassword 
                    reset {
                        expires
                        isExpired
                        token 
                    } 
                    created
                    lastModified
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
                &nbsp;
                <SendButton label="Verify Email" onClick={() => this.sendVerifyEmail (user)} />
            </div>
        );
    }

    /**
     * Request a new email verification email be sent.
     *
     * @param user
     */

    async sendVerifyEmail (user) {
        try {
            const mutation = `
                mutation ($userId: String!) {
                    res: sendVerifyEmail (userId: $userId)
                }
            `;
            const variables = {
                userId: user.id
            };
            const res = await Server._gql (mutation, variables);
            const {snackbarStore} = this.props;
            snackbarStore.show ("Verification email sent.");
            this.doLoad ();
        }
        catch (e) {
            const { infoDialogStore } = this.props;
            infoDialogStore.showError (e);
        }
        return
    }

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
            emailVerified: <YesNo value={user.emailVerified} labelled={true} />,
        };

        if (user.emailVerification) {
            const prefix = "emailVerification"
            o[`${prefix}.expires`] = user.emailVerification.expires;
            o[`${prefix}.isExpired`] = <YesNo value={user.emailVerification.isExpired} labelled={true} />;
            o[`${prefix}.token`] = user.emailVerification.token;
        } else {
            o.emailVerification = "-";
        }

        o.created = user.created;
        o.lastModified = user.lastModified;

        formatDate (o, [ "created", "lastModified", "emailVerification.expires" ]);
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
                reset: JSON.stringify (userLocal.reset),
            };
            if (userLocal.reset) {
                props.reset = userLocal.reset.token;
                props.expires = userLocal.reset.expires;
                props.isExpired = <YesNo value={userLocal.reset.isExpired} labelled={true} />;
            }
            props.created = userLocal.created;
            props.lastModified = userLocal.lastModified;

            formatDate (props, [ "created", "lastModified", "expires" ]);
            return (
                <div>
                    <PropertyTable value={props} />
                    <br/>
                    <SendButton label={"Forgot Password"} onClick={() => this.resetPassword (user)} />
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
        const variables = {
            email: user.email
        };
        try {
            const res = await Server._gql(mutation, variables);
            const { snackbarStore } = this.props;
            snackbarStore.show ("Forgot password email sent.");
            this.doLoad ();
        }
        catch (e) {
            const { infoDialogStore } = this.props;
            infoDialogStore.showDialog (e);
        }
    }
}

export default wrap (DataUser);

// EOF