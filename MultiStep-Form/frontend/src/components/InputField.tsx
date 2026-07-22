import React from "react";
import "../styles/form.css";


interface InputProps {

  label:string;

  name:string;

  type?:string;

  value?:string | number;

  placeholder?:string;

  error?:string;

  onChange?:
  (
    e:React.ChangeEvent<HTMLInputElement>
  )=>void;

}



const InputField:React.FC<InputProps> = ({
  label,
  name,
  type="text",
  value,
  placeholder,
  error,
  onChange
})=>{


return (

<div>


<label htmlFor={name}>

{label}

</label>


<input

id={name}

name={name}

type={type}

value={value}

placeholder={placeholder}

onChange={onChange}

aria-invalid={
  !!error
}

/>



{
error &&

<p
role="alert"
style={{
color:"red"
}}
>
{error}
</p>

}



</div>

);


};


export default InputField;