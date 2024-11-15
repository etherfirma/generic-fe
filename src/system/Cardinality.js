import React, { Component } from "react";
import {doGql, PreJson, withCommas, wrap} from "../util/Utils";
import {observable, toJS} from "mobx";
import Loading from "../util/Loading";
import Alert from "@mui/material/Alert";
import _ from "lodash";
import PropertyTable from "../util/PropertyTable";
import Button from "@mui/material/Button";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import ErrorBanner from "../util/ErrorBanner";

/**
 *
 */

class Cardinality extends Component {
    store = observable ({
        result: null,
        loading: false,
        error: null
    });

    componentDidMount() {
        this.reload ();
    }

    get query () {
        return `
            query { 
                res: getDataCardinality {
                    collections {
                        collection
                        cardinality
                    }
                }               
            }`;
    }

    get variables () {
        return {};
    }

    reload () {
        doGql (this);
    }

    render() {
        const { loading, result, error } = this.store;

        return (
            <div>

                <h1>Data Cardinality</h1>
                <ErrorBanner error={error} />
                <Loading show={loading} />
                {this.renderResult (result)}

                <br/>
                <Button size="small" variant="outlined" onClick={() => this.reload ()}>
                    <i className="fal fa-redo"></i>
                    &nbsp;
                    Reload
                </Button>
            </div>
        );
    }

    renderResult (result) {
        if (! result) {
            return null;
        }
        const { collections } = toJS (result);
        collections.sort((a, b) => a.collection.localeCompare (b.collection));
        // const props = { };
        // _.each (collections, (collection) => props[collection.collection] = withCommas (collection.cardinality));

        return (
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} size="small" >
                    <TableHead>
                        <TableRow>
                            <TableCell>Index</TableCell>
                            <TableCell>Collection</TableCell>
                            <TableCell>Count</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {_.map (collections, (entry, i) => {
                            return (
                                <TableRow key={i}>
                                    <TableCell>
                                        {i + 1}.
                                    </TableCell>
                                    <TableCell>
                                        {entry.collection}
                                    </TableCell>
                                    <TableCell>
                                        {withCommas (entry.cardinality)}
                                    </TableCell>
                                    <TableCell>
                                        {this.collectionButton (entry.collection)}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    }

    supported = {
        "sender": "senders",
        "templates": "templates",
        "users": "users",
        "user_local": "userLocal",
        "employer": "employer",
        "geo": "geo",
        "employerGeo": "employerGeo",
        "geoTarget": "geoTargets",
        "zipcode": "zipcodes",
        "job": "jobs",
        "batch": "batches"
    };

    collectionButton (which) {
        const found = this.supported [which];
        if (found) {
            return (
                <Button variant={"outlined"} size={"small"} onClick={() => {
                    window.location.hash = `/data/${found}`;
                }}>
                    Show All
                </Button>
            );
        } else {
            return null;
        }
    }
}

export default wrap (Cardinality);

// EOF