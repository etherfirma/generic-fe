import React, { Component } from "react";
import { wrap } from "../../util/Utils";
import _ from "lodash";
import {observable} from "mobx";

/**
 *
 */

class UserTemplate extends Component {
    store = observable ({

    });

    render () {
        return (
            "hello world"
        );
    }
}

export default wrap (UserTemplate);

// EOF