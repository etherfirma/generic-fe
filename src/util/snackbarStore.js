import React, { Component } from 'react';
import {action, observable} from "mobx";
import { Snackbar, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { wrap } from './Utils';

const snackbarStore = observable ({
    content: null,
    duration: null,
    open: false,

    show: action ((content, duration = 3000) => {
        snackbarStore.content = content;
        snackbarStore.duration = duration;
        snackbarStore.open = true;
        return;
    })
});

class SnackbarPopop extends Component {
    render () {
        const { snackbarStore } = this.props
        const { content, duration, open } = snackbarStore;

        const handleClose = (event, reason) => {
            if (reason === 'clickaway') {
                return;
            }

            snackbarStore.open = false;
        };

        return (
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                open={open}
                autoHideDuration={duration}
                onClose={handleClose}
                message={content}
                action={
                    <React.Fragment>
                        {/*<Button color="secondary" size="small" onClick={handleClose}>*/}
                        {/*    UNDO*/}
                        {/*</Button>*/}
                        <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </React.Fragment>
                }
            />
        );
    }
}

export default wrap (SnackbarPopop);

export {
    snackbarStore
};

// EOF