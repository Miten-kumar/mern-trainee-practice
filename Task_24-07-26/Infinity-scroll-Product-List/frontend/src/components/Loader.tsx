interface LoaderProps {

message?: string;

}

export default function Loader({

message="Loading more products..."

}:LoaderProps){


return (

<div

role="status"

aria-live="polite"

className="loader"

>


{message}


</div>

);


}