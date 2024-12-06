
class UserEmployerUtil {
    findUserEmployersGql =  `query ($req: UserEmployerFindRequest!) { 
            findUserEmployers (req: $req) { 
                total 
                skip
                limit            
                results { 
                    id
                    employer {
                        id
                        key
                        name
                        isActive                         
                    }
                    user {
                        id 
                        name
                        email
                    }
                    isActive
                }
            }
        }`;
}

export default new UserEmployerUtil ();

// EOF