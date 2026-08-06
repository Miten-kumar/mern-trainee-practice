import { z } from "zod";


export const registrationSchema = z.object({

    firstName: z
        .string()
        .min(2, "First name is required"),


    lastName: z
        .string()
        .min(2, "Last name is required"),


    email: z
        .string()
        .email("Invalid email"),


    phone: z
        .string()
        .min(10, "Phone number required"),


    age: z
        .coerce
        .number()
        .min(18, "Age must be 18+"),


    employmentStatus: z.enum([
        "STUDENT",
        "EMPLOYED",
        "FREELANCER",
        "UNEMPLOYED"
    ]),


    company: z
        .string()
        .optional(),


    designation: z
        .string()
        .optional(),


    experience: z
        .coerce
        .number()
        .optional(),


    skills: z
        .array(
            z.object({

                name:z
                .string()
                .min(1,"Skill required")

            })
        )
        .min(1,"At least one skill required"),


    resume:z.any().optional(),

    profileImage:z.any().optional()


})
.superRefine((data,ctx)=>{


    if(
        data.employmentStatus==="EMPLOYED"
        &&
        !data.company
    ){

        ctx.addIssue({

            code:"custom",

            path:["company"],

            message:"Company is required"

        });

    }


});


// IMPORTANT
export type RegistrationInput =
z.input<typeof registrationSchema>;


export type RegistrationSchemaType =
z.output<typeof registrationSchema>;