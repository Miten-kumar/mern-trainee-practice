import api from "../api/axios";

import type {
  ApplicationFormData,
} from "../types/form.types";


// Submit Application

export const submitApplication = async (
  data: ApplicationFormData
) => {


  const formData = new FormData();



  formData.append(
    "firstName",
    data.firstName
  );


  formData.append(
    "lastName",
    data.lastName
  );


  formData.append(
    "email",
    data.email
  );


  formData.append(
    "phone",
    data.phone
  );


  formData.append(
    "age",
    String(data.age)
  );


  formData.append(
    "employmentType",
    data.employmentType
  );


  formData.append(
    "companyName",
    data.companyName || ""
  );


  formData.append(
    "experience",
    String(data.experience || 0)
  );


  formData.append(
    "skills",
    JSON.stringify(
      data.skills.filter(
        (skill)=>skill.trim() !== ""
      )
    )
  );


  formData.append(
    "portfolioUrl",
    data.portfolioUrl || ""
  );



  // FILE UPLOAD

  if(data.resume instanceof File){

    formData.append(
      "resume",
      data.resume,
      data.resume.name
    );

  }



  if(data.profileImage instanceof File){

    formData.append(
      "profileImage",
      data.profileImage,
      data.profileImage.name
    );

  }



  console.log(
    "Resume:",
    data.resume
  );


  console.log(
    "Profile Image:",
    data.profileImage
  );



  console.log(
    "FINAL FORMDATA"
  );


  for(
    const [key,value]
    of formData.entries()
  ){

    console.log(
      key,
      value
    );

  }



  const response =
    await api.post(
      "/forms",
      formData
    );


  return response.data;

};