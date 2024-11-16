import React from 'react';
import {encodeUrl, formatDate, If, objGet, wrap} from "../../../util/Utils";
import PropertyTable from "../../../util/PropertyTable";
import ID from "../../../util/ID";
import ThingDetail from "../../thing/ThingDetail";
import Breadcrumb from "../../../util/Breadcrumb";
import Server from "../../../util/Server";
import {DeleteButton, EditButton} from "../../../util/ButtonUtil";
import {geoLink, jobLink} from "../../thing/ThingUtil";
// import {jobTaskLink} from "../../thing/ThingUtil";
import _ from "lodash";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import * as PropTypes from "prop-types";

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
                stateTask { attemptCount state attempts geo { id key } } 
                siteTasks { attemptCount state attempts siteId siteType }
                siteTaskCount
                state
                job { id title employer { id name } geo { id key } }                    
            } 
        }`;
    }

    actions (jobTask) {
        return (
            <div>
                <DeleteButton onClick={()=> {
                    this.delete (jobTask);
                }} />
            </div>
        );
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
        const mutation = `mutation ($id: String!) {
            res: deletejobTask (id: $id) 
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
            state: jobTask.state
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
            return <i>none</i>;
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
            state: stateTask.state,
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

    renderSiteTasks (siteTasks) {
        return (
            <div>
                <h3>Site Tasks</h3>

                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} size="small" >
                        <TableHead>
                            <TableRow>
                                <TableCell>Index</TableCell>
                                <TableCell>State</TableCell>
                                <TableCell>Type</TableCell>
                                <TableCell>Site Name</TableCell>
                                <TableCell>Attempts</TableCell>
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