interface ErrorProps {

message?:string;

retry?:()=>void;

}


export default function ErrorMessage({

message="Failed to load products",

retry

}:ErrorProps){



return (

<div

role="alert"

className="error-message"

>


<p>

⚠ {message}

</p>



{
retry &&

<button

onClick={retry}

>

Retry

</button>

}



</div>

);


}