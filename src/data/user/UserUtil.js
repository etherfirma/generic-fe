import Server from "../../util/Server";
import _ from "lodash";

const userLink = (user) => {
    if (! user) {
        return '-';
    }
    return (
        <span className="ThingLink" onClick={() => window.location.hash = `#/data/user/${user.id}`}>
            {user.email}
        </span>
    )
};

class UserUtil {
    // async removeAll () {
    //     const query = "mutation { res: removeAllUsers }";
    //     return await Server._gql (query);
    // }
    //
    // async addMozUsers () {
    //     const query = "mutation { res: addMozUsers }";
    //     return await Server._gql(query);
    // }
    //
    // async addCloudflareUsers (count) {
    //     const query = "mutation ($count: Int!) { res: addCloudflareUsers (count: $count) }";
    //     const variables = { count };
    //     return await Server._gql (query, variables);
    // }

    /**
     *
     * @param user
     */

    async toggleLocked (user) {
        const query = `
            mutation ($id: String!, $update: UserUpdate!) {
                res: updateUser (id: $id, update: $update) {
                    id 
                    locked 
                }
            }
        `;
        const variables = {
            id: user.id,
            update: {
                locked: Boolean(!user.locked)
            }
        };
        return await Server._gql (query, variables);
    }

    getPublicUrl (user) {
        const id = _.isObject (user) ? user.id : user;
        return `${window.location.origin}/#/public/user/${id}`;
    }

    findUsersGql = `query ($req: UserFindRequest!) { 
            findUsers (req: $req) { 
                total 
                skip
                limit            
                results { 
                    id
                    email
                    name
                    locked  
                    hasUserLocal
                }
            }
        }`;
}

export default new UserUtil ();

export {
    userLink
};

// EOF