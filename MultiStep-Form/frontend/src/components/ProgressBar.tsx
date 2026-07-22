import React from "react";
import "../styles/components.css";


interface ProgressProps {

  step:number;

  total:number;

}


const ProgressBar:React.FC<ProgressProps> = ({
  step,
  total
})=>{


  const progress =
    (step / total) * 100;



  return (

    <div>

      <div
        style={{
          width:"100%",
          height:"10px",
          background:"#ddd",
          borderRadius:"10px"
        }}
      >

        <div

          style={{

            width:`${progress}%`,

            height:"100%",

            background:"#2563eb",

            borderRadius:"10px"

          }}

        />

      </div>


      <p>
        {Math.round(progress)}% Completed
      </p>


    </div>

  );

};


export default ProgressBar;