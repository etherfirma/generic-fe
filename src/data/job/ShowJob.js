import React from 'react';
import {encodeUrl, formatDate, objGet, wrap, toBullets} from "../../util/Utils";
import PropertyTable from "../../util/PropertyTable";
import ID from "../../util/ID";
import ThingDetail from "../thing/ThingDetail";
import Breadcrumb from "../../util/Breadcrumb";
import {AddButton, DeleteButton, EditButton, IconButton, ShowButton} from "../../util/ButtonUtil";
import YesNo from "../../util/YesNo";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import _ from "lodash";
import {TableFooter} from "@mui/material";
import {batchLink, employerLink, geoLink} from "../thing/ThingUtil";
import Server from "../../util/Server";
import {JobState} from "../../util/enum/EnumSlug";

/**
 *
 */

class ShowJob extends ThingDetail {
    constructor () {
        super ({
            type: "Job"
        });
    }

    get query () {
        return `
        query ($id: String!) {
            res: jobById (id: $id) {
                id
                batch { id importType } 
                jobKey
                title
                description
                state
                employer {id key name }
                geo { id key name }
                location { city additional } 
                toApply { url instructions contact } 
                requirements
                compensation
                eeoStatement
                created
                lastModified
            } 
        }`;
    }

    actions (job) {
        return (
            <div>
                <EditButton onClick={() => {
                    window.location.hash = `#/data/job/${job.id}/edit`;
                }} />
                &nbsp;
                <DeleteButton onClick={()=> {
                    this.delete (job);
                }} />
                &nbsp;
                <ShowButton label={"Show Posting"} onClick={() => {
                    window.location.hash = `#/data/posting/${job.id}`;
                }}>
                </ShowButton>
            </div>
        );
    }

    /**
     *
     * @param jobId
     */

    doRender (job) {
        if (! job) {
            return (
                <span>
                    Job not found.
                </span>
            );
        }

        const o = {
            id: <ID snackbar={true} value={job.id} />,
            batch: batchLink (job.batch),
            employer: employerLink (job.employer),
            jobKey: job.jobKey,
            title: job.title,
            description: job.description,
            geo: geoLink (job.geo),
            "location.city": job.location.city,
            "location.additional": job.location.additional || "-",
            "toApply.url": (
                <a className="ThingLink" target="__blank" href={job.toApply.url}>
                    {job.toApply.url}
                </a>
            ),
            "toApply.instructions" : job.toApply.instructions,
            "toApply.contact": job.toApply.contact || '-',
            requirements: toBullets (job.requirements),
            compensation: job.compensation || "-",
            eeoStatement: job.eeoStatement || "-",
            state: <JobState value={job.state} />,
            created: job.created,
            lastModified: job.lastModified,
        };

        formatDate (o, [ "created", "lastModified" ]);

        return (
            <div>
                <PropertyTable value={o} size={"small"} />
                <br/>
                {this.actions (job)}
            </div>
        )
    }

    renderHeader () {
        const { result, id } = this.store;
        const crumbs = [
            { label: null, href: "#/" },
            { label: "Jobs", href: "#/data/jobs" },
            { label: result?.name || id}
        ];
        return (
            <div>
                <Breadcrumb crumbs={crumbs} />
                {super.renderHeader ()}
            </div>
        );
    }

    delete (job) {
        const props = {
            title: "Confirm delete",
            body: <p>Really delete <b>job</b>?</p>,
            confirmText: "Delete",
            confirmFunc: () => {
                this.doDelete (job);
            }
        };
        const { infoDialogStore } = this.props;
        infoDialogStore.showDialog (props);
    }

    async doDelete (follow) {
        const mutation = `mutation ($id: String!) {
            res: deleteJob (id: $id) 
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

export default wrap (ShowJob);

// EOF