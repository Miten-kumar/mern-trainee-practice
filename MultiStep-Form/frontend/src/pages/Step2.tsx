import FormButton from "../components/FormButton";

import {
  useFormContext
} from "../context/FormContext";

import {
  useNavigate
} from "react-router-dom";



const Step2 = () => {


const {

  formData,

  setFormData,

  setCurrentStep

} = useFormContext();



const navigate = useNavigate();




const addSkill = () => {


setFormData({

...formData,

skills:[

...formData.skills,

""

]

});


};




const updateSkill = (

index:number,

value:string

)=>{


const updatedSkills = [

...formData.skills

];


updatedSkills[index] = value;



setFormData({

...formData,

skills:updatedSkills

});


};




const handleNext =()=>{


setCurrentStep(3);

navigate("/step3");


};




const handleBack =()=>{


setCurrentStep(1);

navigate("/");


};




return (

<div className="step-container">


<h2>
Professional Details
</h2>



<div className="form-group">


<label>
Employment Type
</label>


<select

value={formData.employmentType}

onChange={(e)=>

setFormData({

...formData,

employmentType:
e.target.value as any

})

}

>


<option value="">
Select Employment Type
</option>


<option value="Student">
Student
</option>


<option value="Professional">
Professional
</option>


<option value="Freelancer">
Freelancer
</option>


</select>


</div>





{
formData.employmentType === "Professional" &&

<div className="form-group">


<label>
Company Name
</label>


<input

type="text"

value={formData.companyName}

placeholder="Enter company name"

onChange={(e)=>

setFormData({

...formData,

companyName:e.target.value

})

}


/>


</div>

}





<div className="form-group">


<label>
Experience (Years)
</label>


<input

type="number"

value={formData.experience}

onChange={(e)=>

setFormData({

...formData,

experience:Number(e.target.value)

})

}

/>


</div>





<h3>
Skills
</h3>



{

formData.skills.map(

(skill,index)=>(


<input

key={index}

type="text"

placeholder="Enter skill"

value={skill}

onChange={(e)=>

updateSkill(

index,

e.target.value

)

}

/>


)

)

}




<button

type="button"

onClick={addSkill}

>

+ Add Skill

</button>





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


export default Step2;