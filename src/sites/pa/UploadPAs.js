import React, { Component } from "react";
import ThingImport from "../../data/thing/ThingImport";
import _ from "lodash";
import { wrap } from "../../util/Utils";
import {ShowButton} from "../../util/ButtonUtil";

/**
 *
 */

class UploadPAs extends ThingImport {
    constructor () {
        super("PA");
    }

    actions () {
        return (
            <>
                {super.actions()}
                &nbsp;
                <ShowButton onClick={() => window.location.hash = `/sites/pa/find`}/>
            </>
        );
    }

    get query () {
        return `
           mutation ($file: String!) {
                res: uploadProfessionalAssociations (file: $file) 
           }
       `;
    }
}

export default wrap (UploadPAs);


// EOF