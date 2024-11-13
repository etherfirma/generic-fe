import React, { Component } from "react";
import ThingImport from "../../data/thing/ThingImport";
import _ from "lodash";
import { wrap } from "../../util/Utils";

/**
 *
 */

class UploadJCs extends ThingImport {
    constructor () {
        super("JC");
    }

    get query () {
        return `
           mutation ($file: String!) {
                res: uploadJobClubs (file: $file) 
           }
       `;
    }
}

export default wrap (UploadJCs);


// EOF