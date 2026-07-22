import {
  useEffect
} from "react";



const STORAGE_KEY =
"job_application_form";



export const usePersistForm = <T>(
  
  data:T,

  setData:
  React.Dispatch<
    React.SetStateAction<T>
  >

)=>{



// Save data

useEffect(()=>{


localStorage.setItem(

STORAGE_KEY,

JSON.stringify(data)

);


},[data]);





// Restore data

useEffect(()=>{


const savedData =
localStorage.getItem(
STORAGE_KEY
);



if(savedData){


setData(

JSON.parse(savedData)

);


}



},[]);



};




export const clearFormStorage = ()=>{


localStorage.removeItem(
STORAGE_KEY
);


}; 