
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
                    geo { id key } 
                    url        
                }
            }
        }`;
}

export default new JCUtil ();

// EOF