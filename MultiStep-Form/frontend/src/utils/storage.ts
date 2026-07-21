const FORM_KEY =
"multi_step_form_data";



// Save Form Data

export const saveFormData = <T>(

data:T

)=>{


localStorage.setItem(

FORM_KEY,

JSON.stringify(data)

);


};





// Get Form Data

export const getFormData = <T>():T | null =>{


const data =

localStorage.getItem(
FORM_KEY
);



if(!data){

return null;

}



return JSON.parse(data);


};





// Clear Form Data

export const clearFormData = ()=>{


localStorage.removeItem(
FORM_KEY
);


};