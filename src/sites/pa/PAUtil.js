
class PAUtil {
    findPAsGql =  `query ($req: ProfessionalAssociationFindRequest!) { 
            findProfessionalAssociations (req: $req) { 
                total 
                skip
                limit            
                results { 
                    id           
                    name
                    url
                    certification    
                }
            }
        }`;
}

export default new PAUtil ();

// EOF