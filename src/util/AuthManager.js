/**
 * Used to manage the login state of the client and the associated
 * tokens needed for operations against the server.
 */
import {action, observable} from "mobx";
import Server from "./Server";
import _ from "lodash";
import {infoDialogStore} from "./InfoDialog";

class AuthManager {
    store = observable ({
        csrfToken: null,
        user: null
    });

    setLogin = action ((res) => {
        const { user, csrfToken } = res;
        this.store.user = user;
        this.store.csrfToken = csrfToken;
        // Server.csrfToken = csrfToken;
        localStorage.setItem ("csrfToken", csrfToken);
        this.notifyLogin (user);
        return;
    });

    loginGoogle = action (async (success) => {
        const mutation = `
            mutation ($success: GoogleSuccessInput!) {
              res: loginGoogle (success: $success) {
                csrfToken
                user {
                    id
                    email
                    name
                }
                token {
                  version
                  uid
                  expires
                  signature
                  encoded
                }
              }
            }`;
        const variables = { success };
        try {
            const res = await Server._gql (mutation, variables);
            const { user, csrfToken } = res;
            this.setLogin ({
                user, csrfToken
            });
        }
        catch (e) {
            infoDialogStore.showError(e);
        }
    });

    loginLink = action (async (email, token) => {
        const mutation = `
            mutation ($email: String!, $token: String!) {
              res: loginLink (email: $email, token: $token) {
                csrfToken
                user {
                    id
                    email
                    name
                }
                token {
                  version
                  uid
                  expires
                  signature
                  encoded
                }
              }
            }`;
        const variables = {
            email, token
        };
        try {
            const res = await Server._gql (mutation, variables);
            const { user, csrfToken } = res;
            this.setLogin ({
                user, csrfToken
            });
        }
        catch (e) {
            infoDialogStore.showError(e);
        }
    });

    skip = action (() => {
        console.log ("skip");
        const user = {
            id: 1,
            email: "lee.crawford@gmail.com",
            name: "Lee Crawford"
        };
        const csrfToken = "x";
        const res = { user, csrfToken };
        this.setLogin (res);
        return;
    })

    login = action (async (email, password) => {
        const mutation = `
            mutation ($email: String!, $password: String!) {
              res: loginPassword (email: $email, password: $password) {
                csrfToken
                user {
                    id
                    email
                    name
                }
                token {
                  version
                  uid
                  expires
                  signature
                  encoded
                }
              }
            }`;
        const variables = {
            email, password
        };
        try {
            const res = await Server._gql(mutation, variables);
            const { user, csrfToken } = res;
            this.setLogin ({
                user, csrfToken
            });
        }
        catch (e) {
            infoDialogStore.showError(e);
        }
    });

    logout = action (() => {
        this.store.csrfToken = null;
        this.store.user = null;
        // Server.csrfToken = null;
        localStorage.removeItem ("session");
        this.notifyLogout();
    });

    get user () {
        return this.store.user;
    }

    get csrfToken () {
        return this.store.csrfToken;
    }

    get isLoggedIn () {
        return this.store.csrfToken !== null;
    }

    // Add support for listeners that want to be notified of successful logins.

    loginListeners = [];
    addLoginListener = action ((ler) => this.loginListeners.push (ler));
    notifyLogin = (user) => {
        _.forEach (this.loginListeners, (ler) => {
            ler (user);
        })
    };

    // Add support for listeners that want to be notified of logouts.

    logoutListeners = []
    addLogoutListener = action ((ler) => this.logoutListeners.push (ler));
    notifyLogout = () => {
        _.forEach (this.logoutListeners, (ler) => {
            ler ();
        });
    }
}

const AUTH_MANAGER = new AuthManager ();

// Example use of the login and logout listener capability.
AUTH_MANAGER.addLogoutListener (() => console.log ("LOGOUT"));
AUTH_MANAGER.addLoginListener ((user) => console.log ("LOGIN", user));

export default AUTH_MANAGER;

// EOF