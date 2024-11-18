import React, { Component } from "react";
import ThingImport from "../../data/thing/ThingImport";
import _ from "lodash";
import { wrap } from "../../util/Utils";
import {ShowButton} from "../../util/ButtonUtil";

/**
 *
 */

class UploadAJCs extends ThingImport {
    constructor () {
        super("AJC");
    }

    actions () {
        return (
            <>
                {super.actions()}
                &nbsp;
                <ShowButton onClick={() => window.location.hash = `/sites/ajc/find`}/>
            </>
        );
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