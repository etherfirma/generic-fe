import React, {Component} from "react";
import Breadcrumb from "../util/Breadcrumb";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import _ from "lodash";


class DataBrowser extends Component {
    crumbs = [
        {label: null, href: "#/"},
        {label: "Data Browser"},
    ];

    dataTypes = [
        {name: "user", hash: "#/data/users", "desc": "The core User record" },
        {name: "userLocal", hash: "#/data/userLocals", "desc": "For User's with a password" },
        {name: "geo", hash: "#/data/geos", "desc": "Supported States and Territories" },
        {name: "geoTarget", hash: "#/data/geoTargets", "desc": "Maps the publishing target for a Geo" },
        {name: "sender", hash: "#/data/senders", "desc": "Email senders" },
        {name: "template", hash: "#/data/templates", "desc": "Email and text templates" },
        {name: "employers", hash: "#/data/employers", "desc": "Registered Employers" },
        {name: "employerGeos", hash: "#/data/employerGeos", "desc": "Employer to Geo mapping" },
        {name: "job", hash: "#/data/jobs", "desc": "A canonicalized Job" },
        {name: "zipcode", hash: "#/data/zipcodes", "desc": "Zipcode lat/lon mappings" },
    ];

    render() {
        const sorted = _.sortBy(this.dataTypes, (o) => o.name);
        return (
            <div>
                <Breadcrumb crumbs={this.crumbs}/>
                <h1>DataBrowser</h1>

                <TableContainer component={Paper}>
                    <Table sx={{minWidth: 650}} size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Index</TableCell>
                                <TableCell>DataType</TableCell>
                                <TableCell>Description</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {_.map(sorted, (dataType, i) => {
                                return (
                                    <TableRow key={i}>
                                        <TableCell component="th" scope="row">
                                            {i + 1}.
                                        </TableCell>
                                        <TableCell>
                                            <a className="ThingLink"
                                               onClick={() => window.location.hash = dataType.hash}>
                                                {dataType.name}
                                            </a>
                                        </TableCell>
                                        <TableCell>
                                            {dataType.desc}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        );
    }
}

export default DataBrowser;

// EOF