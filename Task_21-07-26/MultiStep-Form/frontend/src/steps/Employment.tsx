import { useFormContext } from "react-hook-form";

import type { RegistrationSchemaType } from "../schemas/registration.schema";


const Employment = ()=>{

const {

register,

watch,

formState:{
errors
}

}=useFormContext<RegistrationSchemaType>();

const status =
watch("employmentStatus");

return (

<div>

<h2>
Employment Details
</h2>

<label>
Employment Status
</label>


<select
{...register("employmentStatus")}
>

<option value="STUDENT">
Student
</option>


<option value="EMPLOYED">
Employed
</option>


<option value="FREELANCER">
Freelancer
</option>


<option value="UNEMPLOYED">
Unemployed
</option>


</select>

{
status==="EMPLOYED"
&&

<>

<label>
Company
</label>


<input
{...register("company")}
/>

<p>
{errors.company?.message}
</p>


<label>
Designation
</label>


<input
{...register("designation")}
/>

<p>
{errors.designation?.message}
</p>


<label>
Experience
</label>

<input

type="number"

{...register("experience")}

/>

</>

}

</div>

);

};

export default Employment;