import React from 'react';
import {encodeUrl, formatDate, objGet, wrap, toBullets} from "../../../util/Utils";
import PropertyTable from "../../../util/PropertyTable";
import ID from "../../../util/ID";
import ThingDetail from "../../thing/ThingDetail";
import Breadcrumb from "../../../util/Breadcrumb";
import {AddButton, DeleteButton, EditButton, IconButton, ShowButton} from "../../../util/ButtonUtil";
import {batchLink, employerLink, geoLink} from "../../thing/ThingUtil";
import Server from "../../../util/Server";
import {JobState} from "../../../util/enum/EnumSlug";

/**
 *
 */

class ShowRawJob extends ThingDetail {
    constructor () {
        super ({
            type: "RawJob"
        });
    }

    get query () {
        return `
        query ($id: String!) {
            res: rawJobById (id: $id) {
                id
                batch { id importType } 
                jobKey
                blob
            } 
        }`;
    }

    actions (job) {
        return (
            <div>
            </div>
        );
    }

    /**
     *
     */

    doRender (rawJob) {
        if (! rawJob) {
            return (
                <span>
                    RawJob not found.
                </span>
            );
        }

        const o = {
            id: <ID snackbar={true} value={rawJob.id} />,
            batch: batchLink (rawJob.batch),
            jobKey: rawJob.jobKey,
            blob: rawJob.blob
        };

        return (
            <div>
                <PropertyTable value={o} size={"small"} />
                <br/>
                {this.actions (rawJob)}
            </div>
        )
    }

    renderHeader () {
        const { result, id } = this.store;
        const crumbs = [
            { label: null, href: "#/" },
            { label: "RawJobs", href: "#/data/rawJobs" },
            { label: id }
        ];
        return (
            <div>
                <Breadcrumb crumbs={crumbs} />
                {super.renderHeader ()}
            </div>
        );
    }
}

export default wrap (ShowRawJob);

// EOF