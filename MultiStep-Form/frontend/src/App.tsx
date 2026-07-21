import Stepper from "./components/Stepper";
import ProgressBar from "./components/ProgressBar";

import AppRoutes from "./routes/AppRoutes";

import {
  FormProvider,
  useFormContext
} from "./context/FormContext";



const FormLayout = () => {


const {
  currentStep
} = useFormContext();



return (

<div className="container">


<h1>
Job Application Form
</h1>



<ProgressBar

step={currentStep}

total={4}

/>



<Stepper

currentStep={currentStep}

/>



<AppRoutes />


</div>

);

};




function App() {


return (

<FormProvider>

<FormLayout />

</FormProvider>

);

}



export default App;