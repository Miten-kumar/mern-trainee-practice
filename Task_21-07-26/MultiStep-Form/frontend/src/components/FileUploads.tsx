interface Props {

    label:string;

    name:string;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    register:any;

    error?:string;

    accept:string;

}


const FileUpload = ({
    label,
    name,
    register,
    error,
    accept
}:Props)=>{


return (

<div>

<label htmlFor={name}>

{label}

</label>

<input

id={name}

type="file"

accept={accept}

{...register(name)}

/>

{
error &&

<p
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

export default FileUpload;