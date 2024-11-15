import React, { Component } from "react";
import {observable} from "mobx";
import {doGql} from "./Utils";

/**
 * Fetches the environment details from the server.
 */

class Environment {
    store = observable ({
        result: null,
        results: null,
        error: null,
        loading: false
    });

    get query () {
        return "{ res: serverVersion { version env } }";
    }

    get variables () {
        return {};
    }

    get version () { return this.store.result?.version || "?.?.?"; }
    get environment () { return this.store.result?.env || "?" }

    async load () {
        const result = await doGql (this);
    }
}

export default new Environment ();

// EOF