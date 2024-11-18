import {createHashRouter} from "react-router-dom";
import Login from "../login/Login";
import Register from "../login/Register";
import ForgotPassword from "../login/Forgot";
import React from "react";
import LoginLink from "../login/LoginLink";
import ResetPassword from "../login/ResetPassword";
import VerifyEmail from "../login/VerifyEmail";
import RenderJob from "../data/job/RenderJob";

/**
 *
 * @type {Router}
 */

const ANONYMOUS = createHashRouter ([
    {
        path: "/",
        element: <Login />,
        errorElement: <Login />
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/loginLink",
        element: <LoginLink />
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "/verifyEmail",
        element: <VerifyEmail />
    },
    {
        path: "/resetPassword",
        element: <ResetPassword />
    },
    {
        path: "/forgot",
        element: <ForgotPassword/>
    },
    {
        path: "/data/job/:id",
        elements: <RenderJob />
    }
]);

export default ANONYMOUS;

// EOF