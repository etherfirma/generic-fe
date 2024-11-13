
class JCUtil {
    findJCsGql =  `query ($req: JobClubFindRequest!) { 
            findJobClubs (req: $req) { 
                total 
                skip
                limit            
                results { 
                    id           
                    name
                    city
                    state
                    url        
                }
            }
        }`;
}

export default new JCUtil ();

// EOF