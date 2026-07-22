import {
  useNavigate
} from "react-router-dom";

import {
  clearFormData
} from "../utils/storage";



const Success =()=>{


const navigate = useNavigate();



const handleNewApplication =()=>{


clearFormData();


navigate("/");


};




return (

<div className="step-container success-page">


<h1>
🎉 Application Submitted Successfully
</h1>



<p>

Thank you for completing the
multi-step registration form.

</p>



<p>

Your details have been saved
successfully.

</p>



<button

onClick={handleNewApplication}

>

Create New Application

</button>



</div>

);


};


export default Success;