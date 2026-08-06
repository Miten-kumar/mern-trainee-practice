interface Props {

    currentStep:number;

    totalSteps:number;

}


const ProgressBar = ({
    currentStep,
    totalSteps
}:Props)=>{

    const progress =
    (currentStep / totalSteps) * 100;

    return (

        <div>

            <p>
                Step {currentStep} of {totalSteps}
            </p>

            <div
            style={{
                width:"100%",
                height:"10px",
                background:"#ddd",
                borderRadius:"10px"
            }}
            >

                <div

                style={{
                    width:`${progress}%`,
                    height:"100%",
                    background:"green",
                    borderRadius:"10px"
                }}

                />

            </div>

        </div>
    );
};


export default ProgressBar;