import {
    useState,
    useEffect
}
from "react";


import {
    useForm,
    FormProvider
}
from "react-hook-form";


import {
    zodResolver
}
from "@hookform/resolvers/zod";


import {

    registrationSchema,

    type RegistrationInput,

    type RegistrationSchemaType

}
from "../schemas/registration.schema";



import {
    createRegistration
}
from "../api/registration.api";



import ProgressBar
from "../components/ProgressBar";


import NavigationButtons
from "../components/NavigationButtons";


import PersonalInfo
from "../steps/PersonalInfo";


import Employment
from "../steps/Employment";


import Skills
from "../steps/Skills";


import Documents
from "../steps/Documents";


import Review
from "../steps/Review";




const steps = [

    PersonalInfo,

    Employment,

    Skills,

    Documents,

    Review

];




const RegistrationForm = ()=>{


const [
    currentStep,
    setCurrentStep
]
=
useState(1);




const methods =
useForm<
    RegistrationInput,
    any,
    RegistrationSchemaType
>({


    resolver:
    zodResolver(registrationSchema),



    mode:"onBlur",



    defaultValues:{


        firstName:"",


        lastName:"",


        email:"",


        phone:"",


        age:18,



        employmentStatus:"STUDENT",



        company:"",



        designation:"",



        experience:0,



        skills:[

            {

                name:""

            }

        ]

    }


});





const {

    handleSubmit,

    watch,

    reset

}
=
methods;





// Save form progress

useEffect(()=>{


    const subscription =

    watch((value)=>{


        localStorage.setItem(

            "registration-data",

            JSON.stringify(value)

        );


    });



    return ()=>{

        subscription.unsubscribe();

    };


},[watch]);







// Restore saved data

useEffect(()=>{


    const saved =

    localStorage.getItem(
        "registration-data"
    );



    if(saved){


        reset(

            JSON.parse(saved)

        );

    }



},[reset]);









const onSubmit =
async(
    data:RegistrationSchemaType
)=>{


try{


    const formData =

    new FormData();





    Object.entries(data)
    .forEach(
    ([key,value])=>{



        if(key==="skills"){


            formData.append(

                "skills",

                JSON.stringify(value)

            );


        }



        else if(

            key==="resume"
            ||
            key==="profileImage"

        ){


            const files =

            value as FileList;



            if(files && files.length>0){


                formData.append(

                    key,

                    files[0]

                );

            }


        }



        else{


            formData.append(

                key,

                String(value)

            );


        }



    });







    const response =

    await createRegistration(

        formData

    );



    console.log(
        response
    );



    alert(

        "Registration successful"

    );



    localStorage.removeItem(

        "registration-data"

    );



}


catch(error){


    console.log(
        error
    );



    alert(

        "Something went wrong"

    );


}



};






const CurrentStep =

steps[currentStep-1];





return (

<FormProvider

{...methods}

>


<form

onSubmit={

    handleSubmit(onSubmit)

}

>



<h1>

Multi Step Registration

</h1>




<ProgressBar

currentStep={currentStep}

totalSteps={steps.length}

/>





<CurrentStep />





<NavigationButtons


currentStep={currentStep}


totalSteps={steps.length}



next={()=>{


    if(currentStep < steps.length)

    setCurrentStep(

        currentStep+1

    );


}}




previous={()=>{


    if(currentStep>1)

    setCurrentStep(

        currentStep-1

    );


}}


/>





</form>


</FormProvider>

);


};



export default RegistrationForm;