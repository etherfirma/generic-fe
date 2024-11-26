import React from 'react';
import {encodeUrl, formatDate, If, objGet, wrap} from "../../../util/Utils";
import PropertyTable from "../../../util/PropertyTable";
import ID from "../../../util/ID";
import ThingDetail from "../../thing/ThingDetail";
import Breadcrumb from "../../../util/Breadcrumb";
import Server from "../../../util/Server";
import {DeleteButton, EditButton, ResetButton, UploadButton} from "../../../util/ButtonUtil";
import {ajcLink, employerLink, geoLink, jcLink, jobLink, wdbLink} from "../../thing/ThingUtil";
import _ from "lodash";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import * as PropTypes from "prop-types";
import {TaskState} from "../../../util/enum/EnumSlug";
import "./css/ShowJobTask.css";

function TableCall(props) {
    return null;
}

TableCall.propTypes = {children: PropTypes.node};

/**
 * 
 */

class FindJobTasks extends ThingDetail {
    constructor () {
        super ({
            type: "JobTask"
        });
    }

    get query () {
        return `
        query ($id: String!) {
            res: jobTaskById (id: $id) {
                id
                stateTask { attemptCount state attempts geo { id key } result } 
                siteTasks { 
                    attemptCount state attempts siteId siteType result
                    ajc { id name } 
                    jc { id name } 
                    wdb { id wdbName }  
                }
                siteTaskCount
                state
                job { id title employer { id name } geo { id key } }                    
            } 
        }`;
    }

    actions (jobTask) {
        return (
            <div className={"ActionButtons"}>
                <div>
                    <UploadButton label="Process" onClick={() =>{
                        this.process (jobTask);
                    }} />
                </div>
                <div>
                    <DeleteButton onClick={()=> {
                        this.delete (jobTask);
                    }} />
                    &nbsp;
                    <ResetButton onClick={() =>{
                        this.reset (jobTask);
                        this.doLoad ();
                    }} />
                </div>
            </div>
        );
    }

    async process (jobTask) {
        const query = "mutation ($jobId: String!) { processJobTask (jobId: $jobId) { state } }";
        const variables = { jobId: jobTask.id };
        try {
            this.store.error = null;
            const result = await Server.gql (query, variables);
            if (result.errors.length > 0) {
                this.store.error = result.errors;
            }
            this.doLoad ();
        }
        catch (e) {
            this.store.error = e;
        }
    }

    async reset (jobTask) {
        const query = "mutation ($jobId: String!) { resetJobTask (jobId: $jobId) { state } }";
        const variables = { jobId: jobTask.id };
        try {
            this.store.error = null;
            const result = await Server.gql (query, variables);
            if (result.errors.length > 0) {
                this.store.error = result.errors;
            }
            this.doLoad ();
        }
        catch (e) {
            this.store.error = e;
        }
    }

    delete (jobTask) {
        const props = {
            title: "Confirm delete",
            body: <p>Really delete <b>jobTask</b>?</p>,
            confirmText: "Delete",
            confirmFunc: () => {
                this.doDelete (jobTask);
            }
        };
        const { infoDialogStore } = this.props;
        infoDialogStore.showDialog (props);
    }

    async doDelete (follow) {
        const mutation = `mutation ($jobId: String!) {
            res: deleteJobTask (jobId: $jobId) 
        }`;
        const variables = { jobId: follow.id };
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
     * @param jobTaskId
     */

    doRender (jobTask) {
        if (! jobTask) {
            return (
                <span>
                    jobTask not found.
                </span>
            );
        }

        const o = {
            id: <ID snackbar={true} value={jobTask.id} />,
            "job.title": jobLink (jobTask.job),
            "employer": employerLink (jobTask.job.employer),
            state: <TaskState value={jobTask.state} />
        };

        return (
            <div>
                <PropertyTable value={o} size={"small"} />
                {this.renderStateTask (jobTask.stateTask)}
                {this.renderSiteTasks (jobTask.siteTasks)}
                <br/>
                {this.actions (jobTask)}
            </div>
        )
    }

    renderList (list) {
        if (list.length === 0) {
            return "-";
        }
        return (
            <ul>
                {_.map (list, (el, i) => <li key={i}>{el}</li>)}
            </ul>
        );
    }

    renderStateTask (stateTask) {
        const o = {
            geo: geoLink (stateTask.geo),
            state: <TaskState value={stateTask.state} />,
            attemptCount: stateTask.attempts.length,
            attempts: this.renderList(stateTask.attempts),
            result: stateTask.result || '-',
        };
        return (
            <div>
                <h3>State Task</h3>
                <PropertyTable value={o} size={"small"}/>
            </div>
        );
    }

    siteName (siteTask) {
        switch (siteTask.siteType) {
            case "AJC":
                return ajcLink (siteTask.ajc);
            case "JC":
                return jcLink (siteTask.jc);
            case "WDB":
                return wdbLink (siteTask.wdb);
            default:
                return "???";
        }
    }

    renderSiteTasks (siteTasks) {
        return (
            <div>
                <h3>Site Tasks</h3>

                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} size="small" >
                        <TableHead>
                            <TableRow>
                                <TableCell>Index</TableCell>
                                <TableCell>Site Name</TableCell>
                                <TableCell>Site Type</TableCell>
                                <TableCell>State</TableCell>
                                <TableCell>Attempts</TableCell>
                                <TableCell>Result</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {_.map (siteTasks, (el, i) => {
                                return (
                                    <TableRow key={i}>
                                        <TableCell component="th" scope="row">
                                            {i + 1}.
                                        </TableCell>
                                        <TableCell>
                                            {this.siteName (el)}
                                        </TableCell>
                                        <TableCell>
                                            {el.siteType}
                                        </TableCell>
                                        <TableCell>
                                            <TaskState value={el.state} />
                                        </TableCell>
                                        <TableCell>
                                            {el.attemptCount
                                                ? (
                                                    <div onClick={() => {
                                                        const { infoDialogStore } = this.props;
                                                        infoDialogStore.showJson (el.attempts);
                                                    }}>
                                                        {el.attemptCount}
                                                        &nbsp;
                                                        <i className="fas fa-list"></i>
                                                    </div>
                                                )
                                                : "-"
                                            }
                                        </TableCell>
                                        <TableCell>
                                            {el.result
                                                ? (
                                                    <div onClick={() => {
                                                        const { infoDialogStore } = this.props;
                                                        infoDialogStore.showJson (el.result);
                                                    }}>
                                                        &nbsp;
                                                        <i className="fas fa-list"></i>
                                                    </div>
                                                )
                                                : '-'
                                            }
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                            <If condition={siteTasks.length === 0}>
                                <TableRow>
                                    <TableCell>
                                        None
                                    </TableCell>
                                </TableRow>
                            </If>
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        );
    }

    renderHeader() {
            const {result, id} = this.store;
            const crumbs = [
                { label: null, href: "#/" },
            { label: "jobTasks", href: "#/data/jobTasks" },
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

export default wrap (FindJobTasks);

// EOF