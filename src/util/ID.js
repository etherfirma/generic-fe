import React, { Component } from 'react';
import classnames  from 'classnames';
import './css/ID.css';
import { wrap } from "./Utils";
import {CopyToClipboard} from "react-copy-to-clipboard";

class ID extends Component {
    render () {
        const {value, short, icon, weight, snackbar, ...extra} = this.props;
        const render = short ? `—${value.substring (20, 24)}` : value;
        const el = (
            <span className={"ID"} {...extra}>
                <i className={classnames(weight, icon)}></i>
                &nbsp;
                <tt>{render}</tt>
            </span>
        );
        if (snackbar) {
            return (
                <CopyToClipboard
                    text={value}
                    onCopy={() => {
                        const {snackbarStore} = this.props;
                        snackbarStore.show(`Copied ${value}`);
                    }}
                >
                    {el}
                </CopyToClipboard>
            );
        } else {
            return el;
        }
    }
}

ID.defaultProps = {
    icon: 'fa-key',
    weight: 'fal',
    short: false
};

export default wrap(ID);

// EOF