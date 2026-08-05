import {useState} from "react";
import api from "../api/axios";


const JobForm=()=>{

const [email,setEmail]=useState("");

const [loading,setLoading]=useState(false);



const createEmailJob=async()=>{

try{

setLoading(true);

await api.post("/jobs/email",{

    to:email,

    subject:"Welcome",

    message:"Hello from React Job Queue System"

});


alert("Email Job Created");

setEmail("");

}
catch(error){

console.log(error);

alert("Job creation failed");

}
finally{

setLoading(false);

}

};


return (

<div className="p-5 border rounded">


<h2 className="text-xl font-bold mb-3">

Create Email Job

</h2>

<input

className="border p-2 rounded"

placeholder="Enter email"

value={email}

onChange={
(e)=>setEmail(e.target.value)
}

/>

<button

disabled={loading}

onClick={createEmailJob}

className="bg-blue-600 text-white px-4 py-2 ml-3 rounded"

>

{
loading
?
"Creating..."
:
"Create Job"
}

</button>

</div>

);

};

export default JobForm;