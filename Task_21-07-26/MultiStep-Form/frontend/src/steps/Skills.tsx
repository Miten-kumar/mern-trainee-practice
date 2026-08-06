import {

useFormContext,

useFieldArray

}
from "react-hook-form";


import type {

RegistrationSchemaType

}
from "../schemas/registration.schema";



const Skills = ()=>{


const {

control,

register,

formState:{
errors
}

}=useFormContext<RegistrationSchemaType>();



const {

fields,

append,

remove

}=useFieldArray({

control,

name:"skills"

});



return (

<div>


<h2>
Skills
</h2>



{
fields.map(
(field,index)=>(


<div key={field.id}>


<input

{...register(
`skills.${index}.name`
)}

/>



<button

type="button"

onClick={()=>
remove(index)
}

>

Remove

</button>


</div>


)

)
}



<button

type="button"

onClick={()=>
append({
name:""
})
}

>

Add Skill

</button>



<p>
{
errors.skills?.message
}
</p>



</div>

);

};


export default Skills;