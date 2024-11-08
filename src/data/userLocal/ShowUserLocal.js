import React from 'react';
import {encodeUrl, formatDate, objGet, TabPanel, wrap, PreJson} from "../../util/Utils";
import PropertyTable from "../../util/PropertyTable";
import ID from "../../util/ID";
import ThingDetail from "../thing/ThingDetail";
import YesNo from "../../util/YesNo";
import Breadcrumb from "../../util/Breadcrumb";
import Server from "../../util/Server";
import {DeleteButton, EditButton, ReloadButton} from "../../util/ButtonUtil";

/**
 *
 */

class ShowUserLocal extends ThingDetail {
    constructor () {
        super ({
            type: "UserLocal",
            tab: 0
        });
    }

    get query () {
        return `query ($id: String!) {
                    res: userLocalById (id: $id) {
                        id
                        hashedPassword 
                        reset {
                            expires
                            isExpired
                            token 
                        } 
                        created
                        lastModified
                    } 
                }`;
    }

    actions (userLocal) {
        return (
            <div>
                <DeleteButton onClick={()=> this.delete (userLocal)} />
                &nbsp;
                <ReloadButton onClick={() => this.doLoad ()} />
            </div>
        );
    }

    delete (userLocal) {
        const props = {
            title: "Confirm delete",
            body: <p>Really delete <b>userLocal</b>?</p>,
            confirmText: "Delete",
            confirmFunc: () => {
                this.doDelete (userLocal);
            }
        };
        const { infoDialogStore } = this.props;
        infoDialogStore.showDialog (props);
    }

    async doDelete ({ id }) {
        const mutation = `mutation ($id: String!) {
            res: deleteUserLocal (id: $id) 
        }`;
        const variables = { id };
        try {
            const res = await Server._gql (mutation, variables);
            // ERROR CHECK?
            this.doLoad();
        }
        catch (e) {
            alert (JSON.stringify (e));
        }
    }

    /**
     *
     */

    doRender (userLocal) {
        console.log ("doRender", userLocal);
        if (! userLocal) {
            return (
                <span>
                    User not found.
                </span>
            );
        }

        const o = {
            id: <ID value={userLocal.id} snackbar={true} />,
            hashedPassword: userLocal.hashedPassword,
        };

        if (userLocal.reset) {
            o.reset = userLocal.reset.token;
            o.expires = userLocal.reset.expires;
            o.isExpired = <YesNo value={userLocal.reset.isExpired} labelled={true} />;
        } else {
            o.resetToken = <YesNo value={false} />
        }

        o.created = userLocal.created;
        o.lastModified = userLocal.lastModified;
        formatDate (o, [ "created", "lastModified", "expires" ]);
        return (
            <div>
                <PropertyTable value={o} size={"small"} />
                <br/>
                {this.actions (userLocal)}
            </div>
        )
    }

    renderHeader () {
        const { result, id } = this.store;
        const crumbs = [
            { label: null, href: "#/" },
            { label: "UserLocals", href: "#/data/userLocals" },
            { label: result?.id }
        ];
        return (
            <div>
                <Breadcrumb crumbs={crumbs} />
                {super.renderHeader ()}
            </div>
        );
    }
}

export default wrap (ShowUserLocal);

// EOF