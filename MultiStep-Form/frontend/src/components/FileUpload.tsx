import React from "react";
import "../styles/components.css";


interface FileUploadProps {

  label:string;

  onChange:
  (
    file:File
  )=>void;

  accept?:string;

}



const FileUpload:React.FC<FileUploadProps> = ({
  label,
  onChange,
  accept
})=>{


const handleFile = (
e:React.ChangeEvent<HTMLInputElement>
)=>{


const file =
e.target.files?.[0];


if(file){

  onChange(file);

}


};



return (

<div>


<label>

{label}

</label>


<input

type="file"

accept={accept}

onChange={handleFile}

/>


</div>

);


};


export default FileUpload;