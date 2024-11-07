import React, { Component } from 'react';
import _ from 'lodash';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { observer } from "mobx-react";
import Table from "@mui/material/Table";
import { withCommas } from "../util/Utils";

class DataTable extends Component {
    render () {
        const { headers, xform, rows, skip = 0 } = this.props;
        const { onClick = () => null } = this.props;

        return  (
            <TableContainer component={Paper}>
                <Table size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Index</TableCell>
                            {_.map (headers, (header, i) => {
                                return (
                                    <TableCell key={i}>
                                        {header}
                                    </TableCell>
                                );
                            })}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {_.map (rows, (row, i) => {
                            try {
                                const els = xform(row);
                                return (
                                    <TableRow key={i} onClick={() => onClick (row)}>
                                        <TableCell component="th" scope="row">
                                            {withCommas (i + skip + 1)}.
                                        </TableCell>
                                        {_.map(els, (el, j) => {
                                            return (
                                                <TableCell key={j}>
                                                    {el}
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                );
                            }
                            catch (e) {
                                return (
                                    <TableRow key={i}>
                                        <TableCell component="th" scope="row">
                                            {i + 1}.
                                        </TableCell>
                                        <TableCell colSpan={row.length}>
                                            {e.toString ()}
                                        </TableCell>
                                    </TableRow>
                                );
                            }
                        })}
                        {rows.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={1 + headers.length}>
                                    <i>No data returned</i>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        )
    }
}

export default observer (DataTable);

// EOF