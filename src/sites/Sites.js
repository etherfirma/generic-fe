import React, { Component } from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import _ from "lodash";
import {doGql, objGet, PreJson, wrap, withCommas} from "../util/Utils";
import {ShowButton, IconButton, UploadButton} from "../util/ButtonUtil";
import Breadcrumb from "../util/Breadcrumb";
import {observable} from "mobx";

/**
 *
 */

const SITES = [
    { key: "ajc", name: "American Job Center" },
    { key: "jc", name: "Job Clubs" },
    { key: "pa", name: "Professional Association" },
    { key: "wdb", name: "Workforce Development Board" },
];

class Sites extends Component {
    store = observable ({
        result: null,
        results: null,
        loading: false,
        error: null
    });

    componentDidMount() {
        doGql (this);
    }

    crumbs = [
        { label: null, href: "#/" },
        { label: "Sites" },
    ];

    render() {
        return (
            <div>
                <Breadcrumb crumbs={this.crumbs} />
                <h1>Sites</h1>

                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} size="small" >
                        <TableHead>
                            <TableRow>
                                <TableCell>Index</TableCell>
                                <TableCell>Site</TableCell>
                                <TableCell>Count</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {_.map (SITES, (site, i) => {
                                const total = this.store.results?.data[site.key].total || 0;
                                return (
                                    <TableRow key={i} onClick={() => window.location.hash = `/sites/${site.key}s`}>
                                        <TableCell component="th" scope="row">
                                            {i + 1}.
                                        </TableCell>
                                        <TableCell>
                                            {site.name} ({site.key})
                                        </TableCell>
                                        <TableCell>
                                            {withCommas (total)}
                                        </TableCell>
                                        <TableCell>
                                            <UploadButton onClick={() => window.location.hash=`/sites/${site.key}/upload`} />
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <br/>
                <IconButton icon={"fal fa-globe"} label="Geo Search" onClick={() => window.location.hash = "/sites/radius"} />
            </div>
        );
    }

    get query () {
        return `query {
            ajc: findAmericanJobCenters (req: { filters: {}, skip: 0, limit: 0 }) { total } 
            jc:  findJobClubs (req: { filters: {}, skip: 0, limit: 0 }) { total } 
            pa:  findProfessionalAssociations (req: { filters: {}, skip: 0, limit: 0 }) { total } 
            wdb: findWorkforceDevelopmentBoards (req: { filters: {}, skip: 0, limit: 0 }) { total } 
        }`;
    }

    get variables () {
        return {};
    }
}

export default wrap (Sites);

// EOF