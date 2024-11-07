import React, { Component } from 'react';
import _ from "lodash";
import {fixedPoint, objGet, renderNanos} from "../../util/Utils";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";

class Node {
    constructor (name, el) {
        this.name = name;
        if (el) {
            this.parentType = el.parentType;
            this.returnType = el.returnType;
            this.startOffset = el.startOffset;
            this.duration = el.duration;
        } else {
            this.duration = 0;
        }
        this.children = [];
        return;
    }

    update (trace) {

        // Find the parent node that this should belong to

        let node = this;
        const path = trace.path;
        for (let i = 0; i < path.length - 1; i ++) {
            let name = path[i];
            if (_.isNumber (name)) {
                name = `[${name}]`;
                let maybe = _.find (node.children, (child, i) => child.name === name);
                if (! maybe)  {
                    maybe = new Node (name, null);
                    node.children.push (maybe);
                }
                node = maybe;
            } else {
                node = _.find (node.children, (child, i) => child.name === name);
            }
            if (! node) {
                alert ("Cant find node " + name + " in " + this.name);
                return;
            }
        }

        // Add the new node to the parent

        const child = new Node (path[path.length - 1], trace);
        node.children.push (child);
        return;
    }

    sum (depth = 0) {
        let total = this.duration;
        _.each (this.children, (child, i) => {
            total += child.sum (depth + 1);
        });
        this.total = total;
        this.depth = depth;
        return total;
    }

    render () {
        return (
            <ul>
                <li>
                    <b>{this.name}</b> - {renderNanos (this.total)}
                </li>
                {this.children.length > 0
                    ? _.map (this.children, (child, i) => child.render ())
                    : null
                }
            </ul>
        );
    }

    visit (func) {
        func (this);
        _.each (this.children, (child, i) => child.visit (func));
        return;
    }
}


class GraphQLTracing extends Component {
    xformTrace (els) {
        const root = new Node ("<root>");
        _.each (els, (el, i) => {
            root.update (el)
        });
        root.sum ();
        return root;
    }

    renderTable (tree) {
        const total = tree.sum ();

        const nodes = [];
        tree.visit ((node) => nodes.push (node));

        return (
            <TableContainer component={Paper}>
                <Table size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell size={"small"}>Node</TableCell>
                            <TableCell>Node</TableCell>
                            <TableCell size={"small"}>Time</TableCell>
                            <TableCell size={"small"}>Percentage</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {_.map (nodes, (node, i) => {
                            return (
                                <TableRow key={i}>
                                    <TableCell component="th" scope="row">
                                        {i + 1}.
                                    </TableCell>
                                    <TableCell style={{ paddingLeft: node.depth * 24 }}>
                                        &nbsp;⭢&nbsp;
                                        {node.name}
                                    </TableCell>
                                    <TableCell align="right" size={"small"}>
                                        {renderNanos (node.total)}</TableCell>
                                    <TableCell align="right" size={"small"}>
                                        {fixedPoint (node.total / total * 100)}%
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    }

    render () {
        const { response, elapsed } = this.props;
        const trace = objGet (response, "extensions.tracing");

        if (! trace) {
            return (
                <div>
                    <i>No tracing information.</i>
                </div>
            );
        }

        const { parsing, validation, execution } = trace;
        const { resolvers } = execution;

        if (resolvers.length === 0) {
            return null;
        }

        const first = resolvers[0], last = resolvers[resolvers.length - 1];
        const overall = last.startOffset + last.duration - first.startOffset;
        const tree = this.xformTrace (resolvers);

        return (
            <div>
                <h2>Overview</h2>

                <ul>
                    <li>
                        Timing
                    </li>
                    <ul>
                        <li>
                            <b>parsing</b> - {renderNanos (parsing.duration)}
                        </li>
                        <li>
                            <b>validation</b> - {renderNanos (validation.duration)}
                        </li>
                        <li>
                            <b>execution</b> - {renderNanos (overall)}
                        </li>
                        <li>
                            <b>total</b> - {renderNanos (trace.duration)}
                        </li>
                        <li>
                            <b>network</b> - {renderNanos (elapsed*1000000-trace.duration)}
                        </li>
                    </ul>
                </ul>

                <h2>Trace</h2>

                {this.renderTable (tree)}
            </div>
        );
    }
}

export default GraphQLTracing;

// EOF