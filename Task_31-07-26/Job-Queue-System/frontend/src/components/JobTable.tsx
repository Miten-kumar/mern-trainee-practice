import type { Job } from "../types/job.types";
import JobCard from "./JobCard";


interface Props{

jobs:Job[];

}


const JobTable=({jobs}:Props)=>{


return (

<div className="mt-5">


<h2 className="text-2xl font-bold mb-3">

Jobs

</h2>


{

jobs.length===0

?

<p>No Jobs Available</p>


:

jobs.map(job=>(

<JobCard

key={job.id}

job={job}

/>

))
}

</div>

);

};

export default JobTable;