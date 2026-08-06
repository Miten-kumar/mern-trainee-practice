interface Props {

    currentStep:number;

    totalSteps:number;

    next:()=>void;

    previous:()=>void;

}


const NavigationButtons = ({
    currentStep,
    totalSteps,
    next,
    previous
}:Props)=>{


return (

<div
style={{
display:"flex",
justifyContent:"space-between",
marginTop:"20px"
}}
>

{
currentStep > 1 &&

<button
type="button"
onClick={previous}
>

Previous

</button>

}

{
currentStep < totalSteps &&

<button
type="button"
onClick={next}
>

Next

</button>

}

{
currentStep === totalSteps &&

<button
type="submit"
>

Submit

</button>

}

</div>

);

};

export default NavigationButtons;