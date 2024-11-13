import React, { Component } from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import _ from "lodash";
import {ShowButton, IconButton, UploadButton} from "../util/ButtonUtil";

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
    render() {
        return (
            <div>
                <h1>Sites</h1>

                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} size="small" >
                        <TableHead>
                            <TableRow>
                                <TableCell>Index</TableCell>
                                <TableCell>Site</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {_.map (SITES, (site, i) => {
                                return (
                                    <TableRow key={i}>
                                        <TableCell component="th" scope="row">
                                            {i + 1}.
                                        </TableCell>
                                        <TableCell>
                                            {site.name} ({site.key})
                                        </TableCell>
                                        <TableCell>
                                            <ShowButton onClick={() => window.location.hash=`/sites/${site.key}/find`}/>
                                            &nbsp;
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
}

export default Sites;

// EOF