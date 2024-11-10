import React from 'react';
import {encodeUrl, formatDate, objGet, wrap} from "../../../util/Utils";
import PropertyTable from "../../../util/PropertyTable";
import ID from "../../../util/ID";
import ThingDetail from "../../thing/ThingDetail";
import Breadcrumb from "../../../util/Breadcrumb";
import Server from "../../../util/Server";
import {DeleteButton, EditButton} from "../../../util/ButtonUtil";
import {geoLink, geoTargetLink} from "../../thing/ThingUtil";
import YesNo from "../../../util/YesNo";

/**
 * 
 */

class ShowGeoTarget extends ThingDetail {
    constructor () {
        super ({
            type: "GeoTarget"
        });
    }

    get query () {
        return `
        query ($id: String!) {
            res: geoTargetById (id: $id) {
                id
                geo { id name key } 
                isActive
                url 
            } 
        }`;
    }

    actions (geoTarget) {
        return (
            <div>
                <EditButton onClick={() => {
                    window.location.hash = `#/data/geoTarget/${geoTarget.id}/edit`;
                }} />
                &nbsp;
                <DeleteButton onClick={()=> {
                    this.delete (geoTarget);
                }} />
            </div>
        );
    }

    delete (geoTarget) {
        const props = {
            title: "Confirm delete",
            body: <p>Really delete <b>geoTarget</b>?</p>,
            confirmText: "Delete",
            confirmFunc: () => {
                this.doDelete (geoTarget);
            }
        };
        const { infoDialogStore } = this.props;
        infoDialogStore.showDialog (props);
    }

    async doDelete (follow) {
        const mutation = `mutation ($id: String!) {
            res: deleteGeoTarget (id: $id) 
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
     * @param geoTargetId
     */

    doRender (geoTarget) {
        if (! geoTarget) {
            return (
                <span>
                    GeoTarget not found.
                </span>
            );
        }

        const o = {
            id: <ID snackbar={true} value={geoTarget.id} />,
            geo: geoLink (geoTarget.geo),
            url: (
                <a href={geoTarget.url} target={"__blank"} >
                    {geoTarget.url}
                </a>
            ),
            isActive: <YesNo value={geoTarget.isActive} />,
        };

        return (
            <div>
                <PropertyTable value={o} size={"small"} />
                <br/>
                {this.actions (geoTarget)}
            </div>
        )
    }

    renderHeader () {
        const { result, id } = this.store;
        const crumbs = [
            { label: null, href: "#/" },
            { label: "GeoTargets", href: "#/data/geoTargets" },
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

export default wrap (ShowGeoTarget);

// EOF