import React, { Component } from 'react';
import {styled} from "@mui/material/styles";
import MuiTable from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import MuiTableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import _ from 'lodash';
import './css/PropertyTable.css';

const Table = styled((props) => (
    <MuiTable {...props} />
))(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    '&:not(:last-child)': {
        borderBottom: 0,
    },
    '&:before': {
        display: 'none',
    },
}));

const TableCell = styled((props) => (
    <MuiTableCell {...props} />
))(({ theme }) => ({
    width: "50%"
}));

class PropertyTable extends Component {
    render () {
        const { classes, value, heading1 = "Property", heading2 = "Value", ...props } = this.props;

        return (
            <Table size="small" className={"PropertyTable"} {...props}>
                <TableHead>
                    <TableRow>
                        <TableCell component="th">
                            {heading1}
                        </TableCell>
                        <TableCell component="th">
                            {heading2}
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {_.map (value, (val, key) => {
                        return (
                            <TableRow key={key}>
                                <TableCell component="th" scope="row">
                                    {key}
                                </TableCell>
                                <TableCell>
                                    {val}
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        );
    }
}

export default PropertyTable;

// EOF