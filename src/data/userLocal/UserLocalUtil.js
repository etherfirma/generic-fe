

class UserLocalUtil {
    findUserLocalsGql = `query ($req: UserLocalFindRequest!) { 
            findUserLocals (req: $req) { 
                total 
                skip
                limit            
                results { 
                    id
                    hashedPassword
                    reset {
                        expires
                        token
                        isExpired
                    }
                    created
                    lastModified               
                }
            }
        }`;
}

export default new UserLocalUtil ();

// EOF