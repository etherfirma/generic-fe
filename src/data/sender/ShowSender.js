import React from 'react';
import {encodeUrl, formatDate, objGet, wrap} from "../../util/Utils";
import PropertyTable from "../../util/PropertyTable";
import ID from "../../util/ID";
import ThingDetail from "../thing/ThingDetail";
import Breadcrumb from "../../util/Breadcrumb";
import Server from "../../util/Server";
import {DeleteButton, EditButton} from "../../util/ButtonUtil";
import {senderLink} from "../thing/ThingUtil";

const INIT = {
    type: "Sender"
};

class DataSender extends ThingDetail {
    constructor () {
        super (INIT);
    }

    get query () {
        return `
        query ($id: String!) {
            res: senderById (id: $id) {
                id
                name
                email
                label
                created
                lastModified 
            } 
        }`;
    }

    actions (sender) {
        return (
            <div>
                <EditButton onClick={() => {
                    window.location.hash = `#/data/sender/${sender.id}/edit`;
                }} />
                &nbsp;
                <DeleteButton onClick={()=> {
                    this.delete (sender);
                }} />
            </div>
        );
    }

    delete (sender) {
        const props = {
            title: "Confirm delete",
            body: <p>Really delete <b>sender</b>?</p>,
            confirmText: "Delete",
            confirmFunc: () => {
                this.doDelete (sender);
            }
        };
        const { infoDialogStore } = this.props;
        infoDialogStore.showDialog (props);
    }

    async doDelete (follow) {
        const mutation = `mutation ($id: String!) {
            res: deleteSender (id: $id) 
        }`;
        const variables = { id: follow.id };
        try {
            const res = await Server._gql (mutation, variables);
            this.doLoad();
        }
        catch (e) {
            alert (JSON.stringify (e));
        }
    }

    /**
     *
     * @param senderId
     */

    doRender (sender) {
        if (! sender) {
            return (
                <span>
                    Sender not found.
                </span>
            );
        }

        const o = {
            id: <ID snackbar={true} value={sender.id} />,
            label: sender.label,
            email: senderLink (sender),
            name: sender.name || '-',
            created: sender.created,
            lastModified: sender.lastModified,
        };

        formatDate (o, [ "created", "lastModified" ]);
        return (
            <div>
                <PropertyTable value={o} size={"small"} />
                <br/>
                {this.actions (sender)}
            </div>
        )
    }

    renderHeader () {
        const { result, id } = this.store;
        const crumbs = [
            { label: null, href: "#/" },
            { label: "Senders", href: "#/data/senders" },
            { label: result?.email || id}
        ];
        return (
            <div>
                <Breadcrumb crumbs={crumbs} />
                {super.renderHeader ()}
            </div>
        );
    }
}

export default wrap (DataSender);

// EOF