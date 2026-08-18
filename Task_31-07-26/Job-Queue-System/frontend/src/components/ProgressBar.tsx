interface Props{

    progress:number;

}


const ProgressBar = ({progress}:Props)=>{

return (

<div className="w-full bg-gray-200 rounded">

<div

className="bg-green-500 text-white text-center rounded"

style={{
    width:`${progress}%`
}}

>

{progress}%

</div>

</div>

);

};

export default ProgressBar;