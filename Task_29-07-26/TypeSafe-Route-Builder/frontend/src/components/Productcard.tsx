import type { Product } from "../types/product.types";


interface Props{

    product:Product;

}



export default function ProductCard(
{
product
}:Props
){


return (

<div className="
bg-white
rounded-xl
shadow-md
p-6
hover:shadow-xl
transition
">


<h2 className="
text-xl
font-bold
text-slate-800
">

{product.name}

</h2>


<p className="
text-gray-600
mt-2
">

Category:
<span className="
font-semibold
">

{product.category}

</span>

</p>


<p className="
text-blue-600
font-bold
mt-2
">

${product.price}

</p>


</div>

);


}