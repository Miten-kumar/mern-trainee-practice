import FormButton from "../components/FormButton";

import {
  useFormContext
} from "../context/FormContext";

import {
  submitApplication
} from "../services/form.service";

import {
  useNavigate
} from "react-router-dom";

import {
  useState
} from "react";

import toast from "react-hot-toast";



const Review = () => {


  const {

    formData,

    setCurrentStep

  } = useFormContext();



  const navigate =
    useNavigate();



  const [loading,setLoading] =
    useState(false);




  const handleSubmit = async()=>{


    if(loading) return;



    try{


      setLoading(true);



      const response =
        await submitApplication(
          formData
        );



      console.log(
        "SUBMIT RESPONSE:",
        response
      );



      toast.success(
        "Application submitted successfully"
      );



      setCurrentStep(5);



      navigate(
        "/success"
      );



    }
    catch(error:any){



      console.log(
        "SUBMIT ERROR:",
        error
      );



      toast.error(

        error.response?.data?.message
        ||
        "Form submission failed"

      );



    }
    finally{


      setLoading(false);


    }


  };





  return (

    <div className="step-container">


      <h2>
        Review Your Application
      </h2>



      <div className="review-box">



        <p>

          <strong>
            Name:
          </strong>

          {" "}

          {formData.firstName}

          {" "}

          {formData.lastName}

        </p>




        <p>

          <strong>
            Email:
          </strong>

          {" "}

          {formData.email}

        </p>




        <p>

          <strong>
            Phone:
          </strong>

          {" "}

          {formData.phone}

        </p>




        <p>

          <strong>
            Age:
          </strong>

          {" "}

          {formData.age}

        </p>




        <p>

          <strong>
            Employment Type:
          </strong>

          {" "}

          {formData.employmentType}

        </p>




        {
          formData.companyName &&

          <p>

            <strong>
              Company:
            </strong>

            {" "}

            {formData.companyName}

          </p>
        }




        <p>

          <strong>
            Experience:
          </strong>

          {" "}

          {formData.experience}
          {" "}
          years

        </p>




        <p>

          <strong>
            Skills:
          </strong>

          {" "}

          {
            formData.skills
              .filter(
                skill =>
                skill.trim() !== ""
              )
              .join(", ")
          }

        </p>




        <p>

          <strong>
            Resume:
          </strong>

          {" "}

          {
            formData.resume?.name
            ||
            "No file selected"
          }

        </p>




        <p>

          <strong>
            Profile Image:
          </strong>

          {" "}

          {
            formData.profileImage?.name
            ||
            "No file selected"
          }

        </p>



      </div>





      <div className="navigation">



        <FormButton

          text="Back"

          onClick={()=>{

            setCurrentStep(3);

            navigate(
              "/step3"
            );

          }}

        />





        <FormButton

          text={
            loading
            ?
            "Submitting..."
            :
            "Submit Application"
          }


          disabled={loading}


          onClick={
            handleSubmit
          }


        />



      </div>




    </div>

  );

};


export default Review;