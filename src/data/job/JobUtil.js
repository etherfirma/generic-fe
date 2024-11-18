
class JobUtil {
    findJobsGql =  `query ($req: JobFindRequest!) { 
            findJobs (req: $req) { 
                total 
                skip
                limit            
                results {                
                    id
                    jobKey
                    title
                    description
                    employer { id key name } 
                    geo { id key name } 
                    state
                    created
                    lastModified
                    jobTask { id } 
                }
            }
        }`;
}

export default new JobUtil ();

// EOF