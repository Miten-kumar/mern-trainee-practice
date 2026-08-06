import {

useFormContext

}
from "react-hook-form";


import type {

RegistrationSchemaType

}
from "../schemas/registration.schema";



const Review = ()=>{


const {

watch

}=useFormContext<RegistrationSchemaType>();



const data =
watch();



return (

<div>


<h2>
Review Details
</h2>



<pre>

{
JSON.stringify(
data,
null,
2
)
}

</pre>



</div>

);

};


export default Review;