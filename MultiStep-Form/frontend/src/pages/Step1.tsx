import InputField from "../components/InputField";
import FormButton from "../components/FormButton";

import { useFormContext } from "../context/FormContext";

import { useNavigate } from "react-router-dom";


const Step1 = () => {


const {
  formData,
  setFormData,
  setCurrentStep
} = useFormContext();


const navigate = useNavigate();



const handleChange = (
e: React.ChangeEvent<HTMLInputElement>
)=>{

setFormData({

...formData,

[e.target.name]:
e.target.value

});

};



const handleNext = ()=>{


setCurrentStep(2);


navigate("/step2");


};



return (

<div className="step-container">


<h2>
Personal Details
</h2>



<InputField

label="First Name"

name="firstName"

value={formData.firstName}

onChange={handleChange}

/>



<InputField

label="Last Name"

name="lastName"

value={formData.lastName}

onChange={handleChange}

/>



<InputField

label="Email"

name="email"

type="email"

value={formData.email}

onChange={handleChange}

/>



<InputField

label="Phone"

name="phone"

value={formData.phone}

onChange={handleChange}

/>



<InputField

label="Age"

name="age"

type="number"

value={formData.age}

onChange={handleChange}

/>



<FormButton

text="Next"

onClick={handleNext}

/>



</div>

);

};


export default Step1;