import {
    useFormContext
}
from "react-hook-form";


import type {
    RegistrationInput
}
from "../schemas/registration.schema";



const Documents = ()=>{


const {

register

}
=
useFormContext<RegistrationInput>();



return (

<div>


<h2>
Documents
</h2>


<label>
Resume
</label>


<input

type="file"

accept=".pdf"

{...register("resume")}

/>



<br/>


<label>
Profile Image
</label>


<input

type="file"

accept="image/*"

{...register("profileImage")}

/>



</div>

);


};


export default Documents;