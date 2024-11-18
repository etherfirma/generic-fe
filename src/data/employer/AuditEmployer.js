import React, { Component } from 'react';
import {encodeUrl, formatDate, objGet, PreJson, wrap} from "../../util/Utils";
import PropertyTable from "../../util/PropertyTable";
import ID from "../../util/ID";
import ThingDetail from "../thing/ThingDetail";
import Breadcrumb from "../../util/Breadcrumb";
import {AddButton, DeleteButton, EditButton, IconButton} from "../../util/ButtonUtil";
import YesNo from "../../util/YesNo";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import _ from "lodash";
import {TableFooter} from "@mui/material";
import {geoLink} from "../thing/ThingUtil";
import {GeoType, JobState} from "../../util/enum/EnumSlug";

/**
 *
 */

class AuditEmployer extends Component {
   render () {
       return (
           <div>
               Unimplemented
           </div>
       );
   }
}

export default wrap (AuditEmployer);

// EOF