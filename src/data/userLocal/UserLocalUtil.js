

class UserLocalUtil {
    findUserLocalsGql = `query ($req: UserLocalFindRequest!) { 
            findUserLocals (req: $req) { 
                total 
                skip
                limit            
                results { 
                    id
                    hashedPassword
                    props
                }
            }
        }`;
}

export default new UserLocalUtil ();

// EOF