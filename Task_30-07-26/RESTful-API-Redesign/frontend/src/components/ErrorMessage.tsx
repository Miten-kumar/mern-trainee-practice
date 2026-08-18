interface Props {

    message:string;

}

const ErrorMessage = ({
    message
}:Props)=>{


return (

<div
style={{
    color:"red",
    padding:"20px",
    border:"1px solid red"
}}
>

<h3>
Error
</h3>

<p>
{message}
</p>

</div>

);

};

export default ErrorMessage;