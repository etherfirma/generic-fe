import React, { Component } from "react";
import "./css/Header.css";
import LoginBanner from "../login/LoginBanner";
import { wrap } from "../util/Utils";
import {Avatar} from "@mui/material";
import { House03Icon } from "hugeicons-react";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Button from "@mui/material/Button";
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import logo from "./logo.png";
import AuthManager from "../util/AuthManager";

function stringAvatar(name) {
    return {
        sx: {
            bgcolor: stringToColor(name),
        },
        children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
    };
}

function stringToColor(string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
}

function BasicMenu({ authManager }) {
    const [anchorEl, setAnchorEl] = React.useState (null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <KeyboardArrowDownOutlinedIcon
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
            />
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem
                    onClick={() => {
                        handleClose ();
                        const userId = AuthManager.user.id;
                        window.location.hash = `#/profile/${userId}`;
                    }}
                >
                    Profile
                </MenuItem>
                <MenuItem onClick={handleClose}>My account</MenuItem>
                <MenuItem onClick={() => {
                    authManager.logout ();
                    window.location.hash = "/";
                }}>
                    Logout
                </MenuItem>
            </Menu>
        </div>
    );
}

class Header extends Component {
    render() {
        const { AuthManager } = this.props;
        const user = AuthManager.user;
        return (
            <div className={"Header"}>
                <div onClick={() => window.location.hash = "/"}>
                    {/*<img height={50} src={logo} />*/}
                    <img height={45} src={"https://abide.com/wp-content/uploads/2023/03/Abide_Logo_Horizontal_FullColor_WEB.svg"} />
                </div>
                <div>
                    <table>
                        <tbody>
                        <tr>
                            <td>
                                <Avatar
                                    alt={user.name}
                                    src={"https://cdn.iconscout.com/icon/free/png-512/free-avatar-icon-download-in-svg-png-gif-file-formats--user-boy-avatars-flat-icons-pack-people-456322.png?f=webp&w=256"}
                                />
                            </td>
                            <td>
                                &nbsp;{"" + user.name}
                            </td>
                            <td>
                                <BasicMenu authManager={AuthManager}/>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default wrap (Header);

// EOF