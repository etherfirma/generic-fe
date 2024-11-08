
class EmployerUtil {
    findEmployersGql =  `query ($req: EmployerFindRequest!) { 
            findEmployers (req: $req) { 
                total 
                skip
                limit            
                results { 
                    id
                    key
                    name
                }
            }
        }`;
}

export default new EmployerUtil ();

// EOF