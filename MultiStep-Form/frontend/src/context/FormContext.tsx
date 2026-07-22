import React, {
  createContext,
  useContext,
  useState
} from "react";


import type {
    ApplicationFormData
} from "../types/form.types";


interface FormContextType {

  formData: ApplicationFormData;

  setFormData:
  React.Dispatch<
    React.SetStateAction<ApplicationFormData>
  >;


  currentStep:number;

  setCurrentStep:
  React.Dispatch<
    React.SetStateAction<number>
  >;


  nextStep:()=>void;

  previousStep:()=>void;

}



const defaultFormData:ApplicationFormData = {


  firstName:"",

  lastName:"",

  email:"",

  phone:"",

  age:0,


  employmentType:"",


  companyName:"",


  experience:0,


  skills:[],


  resume:null,


  profileImage:null,


  portfolioUrl:""

};



const FormContext =
createContext<FormContextType | undefined>(
  undefined
);



export const FormProvider = ({
  children
}:{
  children:React.ReactNode
})=>{


const [formData,setFormData] =
useState<ApplicationFormData>(
  defaultFormData
);



const [currentStep,setCurrentStep] =
useState<number>(1);



const nextStep = ()=>{


setCurrentStep(
(prev)=>prev+1
);


};



const previousStep = ()=>{


setCurrentStep(
(prev)=>prev-1
);


};



return (

<FormContext.Provider

value={{

formData,

setFormData,

currentStep,

setCurrentStep,

nextStep,

previousStep

}}

>

{children}

</FormContext.Provider>

);


};




export const useFormContext = ()=>{


const context =
useContext(FormContext);



if(!context){

throw new Error(
"useFormContext must be inside FormProvider"
);

}



return context;


};