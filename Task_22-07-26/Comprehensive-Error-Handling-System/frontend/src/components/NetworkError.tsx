import "../style/error.css";

interface Props{

onRetry?:()=>void;

}


const NetworkError = ({
onRetry
}:Props)=>{


return (

<div className="error-container">


<div className="error-card">


<h2>

Network Error

</h2>


<p>

Please check your internet connection.

</p>



<button

className="retry-btn"

onClick={onRetry}

>

Retry

</button>



</div>


</div>


);


};


export default NetworkError;