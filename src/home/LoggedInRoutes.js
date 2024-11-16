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
import LoadingTest from "../system/tests/ux/LoadingTest";
import PropertyTableTest from "../system/tests/ux/PropertyTableTest";
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
import SendEmailTest from "../system/tests/svc/SendEmailTest";
import TemplateLinkTest from "../system/tests/data/TemplateLinkTest";
import Cardinality from "../system/Cardinality";
import BooleanPickerTest from "../system/tests/ux/BooleanPickerTest";
import FindGeos from "../data/geo/FindGeos";
import ShowGeo from "../data/geo/ShowGeo";
import ShowEmployer from "../data/employer/ShowEmployer";
import FindEmployers from "../data/employer/FindEmployers";
import AddEmployer from "../data/employer/AddEmployer";
import EditEmployer from "../data/employer/EditEmployer";
import UserProfile from "../user/UserProfile";
import EditUserProfile from "../user/EditUserProfile";
import FindEmployerGeos from "../data/employer/geo/FindEmployerGeos";
import AddEmployerGeo from "../data/employer/geo/AddEmployerGeo";
import ShowEmployerGeo from "../data/employer/geo/ShowEmployerGeo";
import GeoPickerTest from "../system/tests/data/GeoPickerTest";
import EmployerPickerTest from "../system/tests/data/EmployerPickerTest";
import FindGeoTargets from "../data/geo/target/FindGeoTargets";
import EditGeoTarget from "../data/geo/target/EditGeoTarget";
import ShowGeoTarget from "../data/geo/target/ShowGeoTarget";
import AddGeoTarget from "../data/geo/target/AddGeoTarget";
import FindJobs from "../data/job/FindJobs";
import AddJob from "../data/job/AddJob";
import ShowJob from "../data/job/ShowJob";
import EditJob from "../data/job/EditJob";
import EnumTest from "../util/enum/EnumTest";
import EnumPickerTest from "../util/enum/EnumPickerTest";
import EnumSlugTest from "../util/enum/EnumSlugTest";
import Graph1 from "../system/tests/graph/Graph1";
import RenderJob from "../data/job/RenderJob";
import Sites from "../sites/Sites";
import FindAJCs from "../sites/ajc/FindAJCs";
import FindPAs from "../sites/pa/FindPAs";
import FindJCs from "../sites/jc/FindJCs";
import FindWDBs from "../sites/wdb/FindWDBs";
import UploadAJCs from "../sites/ajc/UploadAJCs";
import UploadPAs from "../sites/pa/UploadPAs";
import UploadJCs from "../sites/jc/UploadJCs";
import UploadWDBs from "../sites/wdb/UploadWDBs";
import ShowAJC from "../sites/ajc/ShowAJC";
import RadiusSearch from "../sites/RadiusSearch";
import ShowJC from "../sites/jc/ShowJC";
import ShowPA from "../sites/pa/ShowPA";
import ShowWDB from "../sites/wdb/ShowWDB";
import FindZipcodes from "../data/zipcode/FindZipcodes";
import ShowZipcode from "../data/zipcode/ShowZipcode";
import TableTest from "../system/tests/ux/TableTest";
import FindBatches from "../data/job/batch/FindBatches";
import ShowBatch from "../data/job/batch/ShowBatch";
import ImportFeed from "../system/ImportFeed";
import FindJobTasks from "../data/job/task/FindJobTasks";
import ShowJobTask from "../data/job/task/ShowJobTask";
import CreateJobTask from "../data/job/task/CreateJobTask";

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

    { path: "/profile/:id", element: <UserProfile /> },
    { path: "/profile/edit", element: <EditUserProfile /> },

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
    { path: "/data/geos", element: <FindGeos /> },
    { path: "/data/geo/:id", element: <ShowGeo /> },

    { path: "/data/jobs", element: <FindJobs /> },
    { path: "/data/job/add", element: <AddJob /> },
    { path: "/data/job/:id", element: <ShowJob /> },
    { path: "/data/job/:id/edit", element: <EditJob /> },
    { path: "/data/posting/:id", element: <RenderJob /> },

    { path: "/data/jobTasks", element: <FindJobTasks /> },
    { path: "/data/jobTask/create", element: <CreateJobTask /> },
    { path: "/data/jobTask/:id", element: <ShowJobTask /> },


    { path: "/data/employers", element: <FindEmployers /> },
    { path: "/data/employer/add", element: <AddEmployer /> },
    { path: "/data/employer/:id", element: <ShowEmployer /> },
    { path: "/data/employer/:id/edit", element: <EditEmployer /> },
    { path: "/data/employerGeos", element: <FindEmployerGeos /> },
    { path: "/data/employerGeo/add", element: <AddEmployerGeo /> },
    { path: "/data/employerGeo/:id", element: <ShowEmployerGeo /> },

    { path: "/data/zipcodes", element: <FindZipcodes /> },
    { path: "/data/zipcode/:id", element: <ShowZipcode /> },

    { path: "/data/batches", element: <FindBatches /> },
    { path: "/data/batch/:id", element: <ShowBatch /> },


    { path: "/data/geoTargets", element: <FindGeoTargets /> },
    { path: "/data/geoTarget/add", element: <AddGeoTarget /> },
    { path: "/data/geoTarget/:id", element: <ShowGeoTarget /> },
    { path: "/data/geoTarget/:id/:edit", element: <EditGeoTarget /> },

    { path: "/system/cardinality", element: <Cardinality /> },
    { path: "/system/importFeed", element: <ImportFeed /> },

    { path: "/tests/loading", element: <LoadingTest /> },
    { path: "/tests/propertyTable", element: <PropertyTableTest /> },
    { path: "/tests/senderPicker", element: <SenderPickerTest /> },
    { path: "/tests/senderLink", element: <SenderLinkTest /> },
    { path: "/tests/userPicker", element: <UserPickerTest /> },
    { path: "/tests/userLink", element: <UserLinkTest /> },
    { path: "/tests/templatePicker", element: <TemplatePickerTest /> },
    { path: "/tests/templateLink", element: <TemplateLinkTest /> },
    { path: "/tests/svc/sendEmail", element: <SendEmailTest /> },
    { path: "/tests/template", element: <TemplateTest /> },
    { path: "/tests/geoPicker", element: <GeoPickerTest /> },
    { path: "/tests/employerPicker", element: <EmployerPickerTest /> },

    { path: "/tests/ux/booleanPicker", element: <BooleanPickerTest /> },
    { path: "/tests/ux/table", element: <TableTest /> },

    { path: "/tests/enums", element: <EnumTest /> },
    { path: "/tests/enumPickers", element: <EnumPickerTest /> },
    { path: "/tests/enumSlugTest", element: <EnumSlugTest /> },
    { path: "/tests/graph/1", element: <Graph1 /> },

    { path: "/sites", element: <Sites /> },
    { path: "/sites/radius", element: <RadiusSearch /> },

    { path: "/sites/ajc/find", element: <FindAJCs /> },
    { path: "/sites/ajc/upload", element: <UploadAJCs /> },
    { path: "/data/ajc/:id", element: <ShowAJC /> },

    { path: "/sites/pa/find", element: <FindPAs /> },
    { path: "/sites/pa/upload", element: <UploadPAs /> },
    { path: "/data/pa/:id", element: <ShowPA /> },

    { path: "/sites/jc/find", element: <FindJCs /> },
    { path: "/sites/jc/upload", element: <UploadJCs /> },
    { path: "/data/jc/:id", element: <ShowJC /> },

    { path: "/sites/wdb/upload", element: <UploadWDBs /> },
    { path: "/sites/wdb/find", element: <FindWDBs /> },
    { path: "/data/wdb/:id", element: <ShowWDB /> },
]);

export default LOGGED_IN;

// EOF