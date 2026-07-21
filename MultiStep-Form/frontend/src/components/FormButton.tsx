import React from "react";


interface Props{

text:string;

type?:
"button"|"submit";

disabled?:boolean;

onClick?:()=>void;

}



const FormButton:React.FC<Props>=({

text,

type="button",

disabled,

onClick

})=>{


return (

<button

type={type}

disabled={disabled}

onClick={onClick}

>

{text}

</button>

);


};


export default FormButton;