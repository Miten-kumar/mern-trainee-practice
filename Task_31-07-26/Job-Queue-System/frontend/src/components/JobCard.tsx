import type { Job } from "../types/job.types";
import ProgressBar from "./ProgressBar";


interface Props{

job:Job;

}


const JobCard=({job}:Props)=>{

    
const statusColor = {

WAITING:"bg-yellow-400",

ACTIVE:"bg-blue-500",

COMPLETED:"bg-green-500",

FAILED:"bg-red-500"

}[job.status];


return (

<div className="border rounded p-4 mb-3">

<div>

<b>Type:</b> {job.type}

</div>

<div>

<b>Job ID:</b> {job.jobId}

</div>

<div>

<b>Status:</b>

<span

className={`${statusColor} text-white px-2 ml-2 rounded`}

>

{job.status}

</span>

</div>

<div className="mt-3">

<ProgressBar

progress={job.progress}

/>

</div>


{
job.error &&

<div className="text-red-600 mt-2">

Error:
{job.error}

</div>

}

</div>

);

};


export default JobCard;