interface Props {

    route:string;

    generatedUrl:string;

}


export default function RouteCard(
{
route,
generatedUrl
}:Props
){


return (

<div

style={{

border:"1px solid #ccc",

padding:"20px",

borderRadius:"10px"

}}

>


<h3>

Route

</h3>


<p>

{route}

</p>



<h3>

Generated URL

</h3>


<p>

{generatedUrl}

</p>

</div>

);

}