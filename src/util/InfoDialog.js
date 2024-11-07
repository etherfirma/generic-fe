import React, { Component } from 'react';
import {observer} from "mobx-react";
import _ from "lodash";
import {action, observable} from "mobx";
import PrettyPrint from "./PrettyPrint";
import {invokeMaybe} from "./Utils";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";

/**
 *
 */

class InfoDialogStore {
    state = observable ({
        show: false,
        title: null,
        body: null,
        closeText: 'Close',
        closeFunc: null,
        confirmText: null,
        confirmFunc: null,
        dialogProps: null,
        extra: null
    });

    get show () { return this.state.show; }
    get title () { return this.state.title; }
    get body () { return this.state.body; }
    get closeText () { return this.state.closeText; }
    get closeFunc () { return this.state.closeFunc; }
    get confirmFunc () { return this.state.confirmFunc; }
    get confirmText () { return this.state.confirmText; }
    get dialogProps () { return this.state.dialogProps; }
    get extra () { return this.state.extra; }

    doConfirm = action (() => {
        this.doClose ();
        invokeMaybe (this.state.confirmFunc) ();
    })

    doClose = action (() => {
        this.state.show = false;
        invokeMaybe (this.state.closeFunc) ();
    })

    hideDialog = action (() => this.doClose ());

    showDialog = action ((obj) => {
        this.state.title = obj.title || '.title';
        this.state.body = obj.body || '.body';
        this.state.closeText = obj.closeText || 'Close';
        this.state.confirmText = obj.confirmText;
        this.state.confirmFunc = obj.confirmFunc;
        this.state.show = true;
        this.state.dialogProps = obj.dialogProps;
        this.state.extra = obj.extra;
        return;
    })

    showError = action((res) => {
        let title = null;
        let body = null;

        console.log(res instanceof Error);

        if (res instanceof Error) {
            title = res.constructor.name;
            body = (
                <span>
                    <b>{res.constructor.name}:</b>
                    &nbsp;
                    {res.message}
                </span>
            );
        } else {
            title = "GraphQL Errors";
            const errors = res.errors;
            if (_.isArray (res.errors) && errors.length) {
                body = (
                    <ul>
                        {_.map (res.errors, (el, i) => <li key={i}>{el.message}</li>)}
                    </ul>
                );
            } else {
                body = (
                    <pre>{JSON.stringify (res, null, 2)}</pre>
                );
            }
        }

        const params = {
            title,
            body,
            dialogProps: {
                minSize: "sm",
                fullWidth: true
            }
        };
        this.showDialog (params);
        return;
    })

    /**
     * Shows a dialog containing the JSON representation of the passed value.
     */

    showJson = action (json => {
        const params = {
            title: "JSON",
            dialogProps: {
                minSize: "md",
                fullWidth: true
            },
            body: <pre>{JSON.stringify (json, null, 2)}</pre>

        };
        this.showDialog (params);
    })
}

const store = new InfoDialogStore ();


const InfoDialog = (observer (
    class InfoDialog extends Component {
        getActions () {
            const actions = [];

            // Add any extra action buttons that they requested

            _.map (store.extra, (extra, i) => {
                let button = (
                    <Button key={i} onClick={(e) => extra.action ()} color="primary">
                        {extra.label}
                    </Button>
                );
                if (extra.wrap) {
                    button = extra.wrap (button, i);
                }
                actions.push (button);
            });

            if (store.confirmFunc) {
                actions.push (
                    <Button
                        key={"0"}
                        onClick={() => store.doConfirm ()}
                    >
                        {store.confirmText || 'Yes'}
                    </Button>
                )
            }

            actions.push (
                <Button onClick={() => store.doClose ()} color="primary" key={"" + actions.length}>
                    {store.closeText || 'Close'}
                </Button>
            );

            return actions;
        }

        render() {
            return (
                <div>
                    <Dialog
                        onClose={this.handleClose}
                        aria-labelledby="customized-dialog-title"
                        open={store.show}
                        {...store.dialogProps}
                    >
                        <DialogTitle id="customized-dialog-title" onClose={this.handleClose}>
                            {store.title}
                        </DialogTitle>
                        <DialogContent>
                            {store.body}
                        </DialogContent>
                        <DialogActions>
                            {this.getActions ()}
                        </DialogActions>
                    </Dialog>
                </div>
            );
        }
    }
));

export default InfoDialog;

export {
    store as infoDialogStore
};

// EOF