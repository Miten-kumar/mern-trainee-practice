import { useFormContext } from "react-hook-form";

import type { RegistrationSchemaType } from "../schemas/registration.schema";


const PersonalInfo = ()=>{

const {

register,

formState:{
    errors
}

}=useFormContext<RegistrationSchemaType>();


return (

<div>

<h2>
Personal Information
</h2>

<label>
First Name
</label>

<input
{...register("firstName")}
/>

<p>
{errors.firstName?.message}
</p>


<label>
Last Name
</label>

<input
{...register("lastName")}
/>

<p>
{errors.lastName?.message}
</p>

<label>
Email
</label>

<input
type="email"
{...register("email")}
/>

<p>
{errors.email?.message}
</p>


<label>
Phone
</label>

<input
{...register("phone")}
/>

<p>
{errors.phone?.message}
</p>


<label>
Age
</label>

<input

type="number"

{...register("age")}

/>

<p>
{errors.age?.message}
</p>

</div>

);

};

export default PersonalInfo;