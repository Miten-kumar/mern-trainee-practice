import {
  z
} from "zod";



export const formSchema = z.object({



firstName:

z.string()

.min(
  2,
  "First name must be at least 2 characters"
),



lastName:

z.string()

.min(
  2,
  "Last name must be at least 2 characters"
),



email:

z.string()

.email(
  "Invalid email address"
),



phone:

z.string()

.min(
  10,
  "Phone number must be 10 digits"
),



age:

z.coerce.number()

.min(
  18,
  "Age must be above 18"
),



employmentType:

z.enum(
[
"Student",
"Professional",
"Freelancer"
]
),



companyName:

z.string()
.optional(),



experience:

z.number()
.optional(),



skills:

z.array(

z.string()

.min(
1,
"Skill cannot be empty"
)

)
.min(
1,
"Add at least one skill"
),



resume:

z.any()

.refine(

(file)=>file !== null,

"Resume is required"

),



profileImage:

z.any()

.optional(),



portfolioUrl:

z.string()

.optional()


})



// Conditional Validation

.refine(

(data)=>{


if(
data.employmentType === "Professional"
){

return !!data.companyName;

}


return true;


},


{

message:
"Company name is required for professionals",

path:[
"companyName"
]

}


);



export type FormSchemaType =
z.infer<
typeof formSchema
>;