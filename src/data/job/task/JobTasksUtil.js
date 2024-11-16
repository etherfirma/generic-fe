
class JobTaskUtil {
    findJobTasksGql =  `query ($req: JobTaskFindRequest!) { 
            findJobTasks (req: $req) { 
                total 
                skip
                limit            
                results { 
                    id
                    stateTask { attemptCount } 
                    siteTasks { attemptCount }
                    siteTaskCount
                    state
                    job { id title employer { id name } geo { id key } }                    
                }
            }
        }`;
}

export default new JobTaskUtil ();

// EOF