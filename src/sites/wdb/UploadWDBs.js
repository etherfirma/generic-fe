import React, { Component } from "react";
import ThingImport from "../../data/thing/ThingImport";
import _ from "lodash";
import { wrap } from "../../util/Utils";

/**
 *
 */

class UploadWDBs extends ThingImport {
    constructor () {
        super("WDB");
    }

    get query () {
        return `
           mutation ($file: String!) {
                res: uploadWorkforceDevelopmentBoards (file: $file) 
           }
       `;
    }
}

export default wrap (UploadWDBs);


// EOF