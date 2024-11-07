import React, { Component } from 'react';
import _ from 'lodash';
import {Paper} from "@mui/material";

const render = (v) => _.isString (v) ? v : JSON.stringify (v, null, 2);

class PrettyPrint extends Component {
    render () {
        const { value } = this.props;

        return (
            <Paper style={{ width: "100%" }}>
               <pre style={{ padding: 10 }}>
                   {render (value)}
               </pre>
            </Paper>
        );
    }
}

export default PrettyPrint;

// EOF