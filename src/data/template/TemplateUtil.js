
class TemplateUtil {
    findTemplatesGql =  `query ($req: TemplateFindRequest!) { 
            findTemplates (req: $req) { 
                total 
                skip
                limit            
                results { 
                    id                                        
                    path 
                    engine
                }
            }
        }`;
}

export default new TemplateUtil ();

// EOF