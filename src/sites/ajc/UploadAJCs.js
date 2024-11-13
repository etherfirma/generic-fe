import React, { Component } from "react";
import ThingImport from "../../data/thing/ThingImport";
import _ from "lodash";
import { wrap } from "../../util/Utils";

/**
 *
 */

class UploadAJCs extends ThingImport {
    constructor () {
        super("AJC");
    }

    get query () {
        return `
           mutation ($file: String!) {
                res: uploadAmericanJobCenters (file: $file) 
           }
       `;
    }
}

export default wrap (UploadAJCs);


// EOF