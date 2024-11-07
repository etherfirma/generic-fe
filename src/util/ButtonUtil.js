import React, { Component } from "react";
import Button from "@mui/material/Button";

function iconButton (icon, label, props) {
    return (
        <Button variant="outlined" size="small" {...props}>
            <i className={icon}></i>
            &nbsp;
            {label}
        </Button>
    );
}

function IconButton ({ icon, label, ...rest }) {
    return iconButton (icon, label, rest);
}

function AddButton (props) {
    return iconButton ("far fa-plus", "Add", props);
}
function EditButton (props) {
    return iconButton ("far fa-edit", "Edit", props);
}
function ReloadButton (props) {
    return iconButton ("far fa-redo", "Reload", props);
}
function DeleteButton (props) {
    return iconButton ("far fa-times", "Delete", props);
}
function CopyButton (props) {
    return iconButton("fal fa-clipboard", "Copy", props);
}
function CancelButton (props) {
    return iconButton ("fal fa-times", "Cancel", props);
}
function UpdateButton (props) {
    return iconButton ("fal fa-file-alt", "Update", props);
}
function ClearAllButton (props) {
    return iconButton("fas fa-trash", "Clear All", props);
}
function PrettifyButton (props) {
    return iconButton("fal fa-brackets-curly", "Prettify", props);
}

export {
    IconButton,
    AddButton, EditButton, ReloadButton, DeleteButton, CancelButton, UpdateButton, CopyButton,
    ClearAllButton, PrettifyButton
}

// EOF