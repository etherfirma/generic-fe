import React from 'react';
import {encodeUrl, formatDate, objGet, wrap, toBullets, If} from "../../util/Utils";
import PropertyTable from "../../util/PropertyTable";
import ID from "../../util/ID";
import ThingDetail from "../thing/ThingDetail";
import Breadcrumb from "../../util/Breadcrumb";
import {AddButton, DeleteButton, EditButton, IconButton} from "../../util/ButtonUtil";
import _ from "lodash";
import {employerLink, geoLink} from "../thing/ThingUtil";
import Server from "../../util/Server";
import {JobState} from "../../util/enum/EnumSlug";
import "./css/RenderJob.css";

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
                jobKey
                title
                description
                state
                employer {id key name domain }
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

        return (
            <div className={"RenderJob"}>
                <h2>{job.title}</h2>
                Posted by {job.employer.name} (<a href={""}>www.{job.employer.domain}</a>)

                <p>
                    Located in {job.location.city}, {job.geo.name}. <br/>
                    {job.location.additional}
                </p>

                <h4>Job Description</h4>

                <blockquote>
                    {job.description}
                </blockquote>

                <If condition={job.compensation}>
                    <h4>Compensation</h4>
                    {job.compensation}
                </If>

                <h4>Requirements</h4>
                <ul>
                    {_.map (job.requirements, (requirement, i) => {
                        return (
                            <li key={i}>
                                {requirement}
                            </li>
                        );
                    })}
                    </ul>

                <h4>To Apply</h4>

                <p>
                    {job.toApply.instructions}
                </p>

                <ul>
                    <li>
                        <b>URL</b> - <a href={`https://${job.toApply.url}`}>{job.toApply.url}</a>
                    </li>
                    <li>
                        <b>Contact</b> - {job.toApply.contact}
                    </li>
                </ul>

                <If condition={job.eeoStatement}>
                    <h4>EEO Statement</h4>
                    {job.eeoStatement}
                </If>
            </div>
        );

        const o = {
            id: <ID snackbar={true} value={job.id} />,
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
            "toApply.contact": job.toApply.contact,
            requirements: toBullets (job.requirements),
            compensation: job.compensation || "-",
            eeoStatement: job.eeoStatement,
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