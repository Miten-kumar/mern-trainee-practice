import "../style/error.css";

interface Props{

    title:string;

    message:string;

    onRetry?:()=>void;

}

const FallbackUI = ({

    title,

    message,

    onRetry

}:Props)=>{


return (

<div className="error-container">

    <div className="error-card">


        <h2>

            ⚠ {title}

        </h2>

        <p>

            {message}

        </p>

        {
            onRetry &&

            <button

                className="retry-btn"

                onClick={onRetry}

            >

                Try Again

            </button>

        }

    </div>

</div>

);


};

export default FallbackUI;