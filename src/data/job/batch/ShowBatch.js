import React from 'react';
import {encodeUrl, formatDate, objGet, wrap, toBullets, withCommas} from "../../../util/Utils";
import PropertyTable from "../../../util/PropertyTable";
import ID from "../../../util/ID";
import ThingDetail from "../../thing/ThingDetail";
import Breadcrumb from "../../../util/Breadcrumb";
import Server from "../../../util/Server";
import {userLink} from "../../thing/ThingUtil";
import {ShowButton} from "../../../util/ButtonUtil";

/**
 *
 */

class ShowBatch extends ThingDetail {
    constructor () {
        super ({
            type: "Batch"
        });
    }

    get query () {
        return `
        query ($id: String!) {
            res: batchById (id: $id) {
                id
                importType
                user { id name email } 
                jobCount
                created 
            } 
        }`;
    }

    actions (batch) {
        return (
            <div>
                <ShowButton
                    label={"Find Jobs"}
                    onClick={() => window.location.hash=`/data/jobs?batchId=${batch.id}`}
                />
            </div>
        );
    }

    /**
     *
     * @param batchId
     */

    doRender (batch) {
        if (! batch) {
            return (
                <span>
                    Batch not found.
                </span>
            );
        }

        const o = {
            id: <ID snackbar={true} value={batch.id} />,
            jobCount: withCommas (batch.jobCount),
            userId: batch.user ? userLink (batch.user) : '-',
            importType: batch.importType,
            created: batch.created,
        };

        formatDate (o, [ "created" ]);

        return (
            <div>
                <PropertyTable value={o} size={"small"} />
                <br/>
                {this.actions (batch)}
            </div>
        )
    }

    renderHeader () {
        const { result, id } = this.store;
        const crumbs = [
            { label: null, href: "#/" },
            { label: "Batchs", href: "#/data/batchs" },
            { label: result?.name || id}
        ];
        return (
            <div>
                <Breadcrumb crumbs={crumbs} />
                {super.renderHeader ()}
            </div>
        );
    }

    delete (batch) {
        const props = {
            title: "Confirm delete",
            body: <p>Really delete <b>batch</b>?</p>,
            confirmText: "Delete",
            confirmFunc: () => {
                this.doDelete (batch);
            }
        };
        const { infoDialogStore } = this.props;
        infoDialogStore.showDialog (props);
    }

    async doDelete (follow) {
        const mutation = `mutation ($id: String!) {
            res: deleteBatch (id: $id) 
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
}

export default wrap (ShowBatch);

// EOF