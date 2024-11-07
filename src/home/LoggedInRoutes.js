import {createHashRouter} from "react-router-dom";
import Home from "./Home";
import React from "react";
import DataBrowser from "../data/DataBrowser";
import System from "../system/System";
import GraphQLQuery from "../system/gql/GraphQLQuery";
import FindSenders from "../data/sender/FindSenders";
import AddSender from "../data/sender/AddSender";
import ShowSender from "../data/sender/ShowSender";
import EditSender from "../data/sender/EditSender";
import Tests from "../system/tests/Tests";
import LoadingTest from "../system/tests/LoadingTest";
import PropertyTableTest from "../system/tests/PropertyTableTest";
import SenderPickerTest from "../system/tests/data/SenderPickerTest";
import SenderLinkTest from "../system/tests/data/SenderLinkTest";
import FindTemplates from "../data/template/FindTemplates";
import AddTemplate from "../data/template/AddTemplate";
import ShowTemplate from "../data/template/ShowTemplate";
import EditTemplate from "../data/template/EditTemplate";
import FindUsers from "../data/user/FindUsers";
import AddUser from "../data/user/AddUser";
import ShowUser from "../data/user/ShowUser";
import EditUser from "../data/user/EditUser";
import UserPickerTest from "../system/tests/data/UserPickerTest";
import UserLinkTest from "../system/tests/data/UserLinkTest";
import FindUserLocals from "../data/userLocal/FindUserLocals";
import ShowUserLocal from "../data/userLocal/ShowUserLocal";
import TemplatePickerTest from "../system/tests/data/TemplatePickerTest";
import TemplateTest from "../system/tests/data/TemplateTest";

/**
 *
 * @type {Router}
 */

const LOGGED_IN = createHashRouter ([
    {
        path: "/",
        element: <Home />
    },
    {
        path: "/data",
        element: <DataBrowser />
    },
    {
        path: "/system",
        element: <System/>
    },
    { path: "/tests", element: <Tests /> },
    { path: "/system/gql", element: <GraphQLQuery /> },

    { path: "/data/senders", element: <FindSenders /> },
    { path: "/data/sender/add", element: <AddSender /> },
    { path: "/data/sender/:id", element: <ShowSender /> },
    { path: "/data/sender/:id/edit", element: <EditSender /> },
    { path: "/data/templates", element: <FindTemplates /> },
    { path: "/data/template/add", element: <AddTemplate /> },
    { path: "/data/template/:id", element: <ShowTemplate /> },
    { path: "/data/template/:id/edit", element: <EditTemplate /> },
    { path: "/data/users", element: <FindUsers /> },
    { path: "/data/user/add", element: <AddUser /> },
    { path: "/data/user/:id", element: <ShowUser /> },
    { path: "/data/user/:id/edit", element: <EditUser /> },
    { path: "/data/userLocals", element: <FindUserLocals /> },
    { path: "/data/userLocal/:id", element: <ShowUserLocal /> },

    { path: "/tests/loading", element: <LoadingTest /> },
    { path: "/tests/propertyTable", element: <PropertyTableTest /> },
    { path: "/tests/senderPicker", element: <SenderPickerTest /> },
    { path: "/tests/senderLink", element: <SenderLinkTest /> },
    { path: "/tests/userPicker", element: <UserPickerTest /> },
    { path: "/tests/templatePicker", element: <TemplatePickerTest /> },
    { path: "/tests/template", element: <TemplateTest /> },
]);

export default LOGGED_IN;

// EOF