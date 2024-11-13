import React, { Component } from "react";
import ThingImport from "../../data/thing/ThingImport";
import _ from "lodash";
import { wrap } from "../../util/Utils";

/**
 *
 */

class UploadPAs extends ThingImport {
    constructor () {
        super("PA");
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