
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
                    isActive
                }
            }
        }`;
}

export default new EmployerUtil ();

// EOF