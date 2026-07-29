import { useEffect, useState } from "react";
import { getProducts } from "../api/product.api";
import type { Product } from "../types/product.types";
import ProductCard from "../components/Productcard";

export default function Products(){

const [products,setProducts]
=
useState<Product[]>([]);

const [category,setCategory]
=
useState("");

const [sort,setSort]
=
useState<
"asc"|"desc"
>("asc");


useEffect(()=>{

getProducts({

category,
sort

})

.then(data=>{

setProducts(data);

});


},[category,sort]);


return (

<div className="
min-h-screen
bg-slate-100
p-10
">

<h1 className="
text-4xl
font-bold
mb-8
">

Products

</h1>

<div className="
bg-white
rounded-xl
shadow
p-6
mb-8
">

<h2 className="
text-xl
font-semibold
mb-4
">

Query Validation Demo

</h2>


<div className="
flex
gap-5
">

<select

className="
border
rounded
p-3
"

value={category}

onChange={
e=>
setCategory(e.target.value)
}

>

<option value="">
All Categories
</option>

<option value="electronics">
Electronics
</option>

<option value="accessories">
Accessories
</option>

<option value="fashion">
Fashion
</option>

</select>


<select

className="
border
rounded
p-3
"

value={sort}

onChange={
e=>
setSort(
e.target.value as "asc"|"desc"
)
}

>

<option value="asc">
Price Low-High
</option>

<option value="desc">
Price High-Low
</option>

</select>

</div>

</div>

<div className="
bg-green-50
rounded-xl
p-4
mb-8
">

<p className="
font-semibold
text-green-700
">

Generated Query:

</p>


<p className="
font-mono
mt-2
">

/products?
category={category || "all"}
&
sort={sort}

</p>


</div>

<div className="
grid
gap-6
md:grid-cols-2
lg:grid-cols-3
">

{
products.map(product=>(

<ProductCard

key={product.id}

product={product}

/>

))
}

</div>

</div>

);

}