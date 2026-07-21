import FileUpload from "../components/FileUpload";

import FormButton from "../components/FormButton";

import {
  useFormContext
} from "../context/FormContext";

import {
  useNavigate
} from "react-router-dom";




const Step3 =()=>{


const {

formData,

setFormData,

setCurrentStep

}=useFormContext();



const navigate = useNavigate();




const handleNext =()=>{


setCurrentStep(4);

navigate("/review");


};




const handleBack =()=>{


setCurrentStep(2);

navigate("/step2");


};




return (

<div className="step-container">


<h2>
Upload Documents
</h2>



<FileUpload

label="Upload Resume (PDF)"

accept=".pdf"

onChange={(file)=>


setFormData({

...formData,

resume:file

})


}


/>




<FileUpload

label="Upload Profile Image"

accept=".png,.jpg,.jpeg"

onChange={(file)=>


setFormData({

...formData,

profileImage:file

})


}


/>




<div className="navigation">


<FormButton

text="Back"

onClick={handleBack}

/>



<FormButton

text="Next"

onClick={handleNext}

/>


</div>



</div>

);


};



export default Step3;