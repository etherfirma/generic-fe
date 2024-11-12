import React from 'react';
import {encodeUrl, formatDate, objGet, PreJson, wrap} from "../../util/Utils";
import PropertyTable from "../../util/PropertyTable";
import ID from "../../util/ID";
import ThingDetail from "../thing/ThingDetail";
import Breadcrumb from "../../util/Breadcrumb";
import {AddButton, DeleteButton, EditButton, IconButton} from "../../util/ButtonUtil";
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
import {geoLink} from "../thing/ThingUtil";
import {JobState} from "../../util/enum/EnumSlug";

/**
 *
 */

class ShowEmployer extends ThingDetail {
    constructor () {
        super ({
            type: "Employer"
        });
    }

    get query () {
        return `
        query ($id: String!) {
            res: employerById (id: $id) {
                id
                key
                name 
                domain
                isActive
                employerGeos {
                    id
                    geo { id key name }
                    isActive
                }
                jobs {
                    id
                    title
                    geo { id key name }  
                    state
                }
                created
                lastModified
            } 
        }`;
    }

    actions (employer) {
        return (
            <div>
                <EditButton onClick={() => {
                    window.location.hash = `#/data/employer/${employer.id}/edit`;
                }} />
                {/*&nbsp;*/}
                {/*<DeleteButton onClick={()=> {*/}
                {/*    this.delete (employer);*/}
                {/*}} />*/}
            </div>
        );
    }

    /**
     *
     * @param employerId
     */

    doRender (employer) {
        if (! employer) {
            return (
                <span>
                    Employer not found.
                </span>
            );
        }

        const o = {
            id: <ID snackbar={true} value={employer.id} />,
            key: employer.key,
            name: employer.name,
            domain: employer.domain,
            isActive: <YesNo value={employer.isActive} labelled={true} />,
            created: employer.created,
            lastModified: employer.lastModified,
        };

        formatDate (o, [ "created", "lastModified" ]);

        const { employerGeos, jobs } = employer;
        return (
            <div>
                <PropertyTable value={o} size={"small"}/>
                <br/>
                {this.actions(employer)}
                <br/>
                <div>
                    <h2>Active Geos</h2>
                    {employerGeos
                        ? this.renderGeos (employer)
                        : "No geos"
                    }
                </div>
                <div>
                    <h2>Jobs</h2>
                    {jobs
                        ? this.renderJobs (employer)
                        : "No geos"
                    }
                </div>
            </div>
        )
    }

    renderGeos(employer) {
        const {employerGeos} = employer;
        return (
            <div>
                <TableContainer component={Paper}>
                    <Table size="small">
                    <TableHead>
                            <TableRow>
                                <TableCell>Index</TableCell>
                                <TableCell>Key</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Active?</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {_.map (employerGeos, (employerGeo, i) =>
                                <TableRow key={i} onClick={() => {
                                    window.location.hash = `/data/employerGeo/${employerGeo.id}`;
                                }}>
                                    <TableCell component="th" scope="row">
                                        {i + 1}.
                                    </TableCell>
                                    <TableCell>
                                        {geoLink (employerGeo.geo)}</TableCell>
                                    <TableCell>{employerGeo.geo.name}</TableCell>
                                    <TableCell>
                                        <YesNo value={employerGeo.isActive} />
                                    </TableCell>
                                </TableRow>
                            )}
                            {employerGeos.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} scope="row">
                                        No Geos
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <br/>
                <AddButton onClick={() => window.location.hash = `/data/employerGeo/add?employerId=${employer.id}`} />
            </div>
        );
    }

    renderJobs (employer) {
        const { jobs } = employer;
        return (
            <div>
                <TableContainer component={Paper}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Index</TableCell>
                                <TableCell>Title</TableCell>
                                <TableCell>Geo</TableCell>
                                <TableCell>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {_.map (jobs, (job, i) =>
                                <TableRow key={i} onClick={() => {
                                    window.location.hash = `/data/job/${job.id}`;
                                }}>
                                    <TableCell component="th" scope="row">
                                        {i + 1}.
                                    </TableCell>
                                    <TableCell>
                                        {job.title}
                                    </TableCell>
                                    <TableCell>
                                        {geoLink (job.geo)}
                                    </TableCell>
                                    <TableCell>
                                        <JobState value={job.state} />
                                    </TableCell>
                                </TableRow>
                            )}
                            {jobs.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} scope="row">
                                        No Jobs Listed
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <br/>
                <AddButton onClick={() => window.location.hash = `/data/job/add?employerId=${employer.id}`} />
            </div>
        );
    }

    renderHeader () {
        const { result, id } = this.store;
        const crumbs = [
            { label: null, href: "#/" },
            { label: "Employers", href: "#/data/employers" },
            { label: result?.name || id}
        ];
        return (
            <div>
                <Breadcrumb crumbs={crumbs} />
                {super.renderHeader ()}
            </div>
        );
    }
}

export default wrap (ShowEmployer);

// EOF