import React from "react";
import "../styles/components.css";

interface StepperProps {
  currentStep: number;
}


const steps = [
  "Personal Details",
  "Professional Details",
  "Documents",
  "Review"
];


const Stepper: React.FC<StepperProps> = ({
  currentStep
}) => {

  return (

    <div className="stepper">

      {
        steps.map((step,index)=>(
          
          <div
            key={step}
            className={
              currentStep === index + 1
                ? "active step"
                : "step"
            }
          >

            <span>
              {index + 1}
            </span>

            <p>
              {step}
            </p>

          </div>

        ))
      }

    </div>

  );

};


export default Stepper;