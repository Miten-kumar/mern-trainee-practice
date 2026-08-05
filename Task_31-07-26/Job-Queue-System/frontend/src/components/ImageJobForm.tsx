import { useState } from "react";
import api from "../api/axios";


const ImageJobForm = () => {


const [file,setFile] = useState<File | null>(null);

const [loading,setLoading] = useState(false);



const uploadImageJob = async()=>{


if(!file){

alert("Select image first");

return;

}



try{


setLoading(true);



const formData = new FormData();


formData.append(
"image",
file
);



await api.post(
"/jobs/image",
formData,
{
headers:{
"Content-Type":"multipart/form-data"
}
}
);



alert("Image Job Created");


setFile(null);



}
catch(error){

console.log(error);

alert("Image upload failed");

}
finally{

setLoading(false);

}


};



return (

<div className="border p-5 rounded mt-5">


<h2 className="text-xl font-bold mb-3">

Create Image Processing Job

</h2>


<input

type="file"

accept="image/*"

onChange={
(e)=>{

if(e.target.files){

setFile(
e.target.files[0]
);

}

}

}

/>



<button

onClick={uploadImageJob}

disabled={loading}

className="bg-purple-600 text-white px-4 py-2 ml-3 rounded"

>


{
loading
?
"Uploading..."
:
"Process Image"
}


</button>


</div>

);


};


export default ImageJobForm;