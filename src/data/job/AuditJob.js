import React, { Component } from 'react';
import {encodeUrl, formatDate, objGet, wrap, toBullets, If} from "../../util/Utils";
import PropertyTable from "../../util/PropertyTable";
import ID from "../../util/ID";
import ThingDetail from "../thing/ThingDetail";
import Breadcrumb from "../../util/Breadcrumb";
import {AddButton, DeleteButton, EditButton, IconButton} from "../../util/ButtonUtil";
import _ from "lodash";
import {employerLink, geoLink} from "../thing/ThingUtil";
import Server from "../../util/Server";
import {JobState} from "../../util/enum/EnumSlug";
import "./css/RenderJob.css";

/**
 *
 */

class AuditJob extends Component {
    render () {
        return (
            <div>
                Unimplemented
            </div>
        );
    }
}

export default wrap (AuditJob);

// EOF