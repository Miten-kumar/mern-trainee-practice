import type { Product } 
from "../types/product.types";


interface ProductCardProps {

    product: Product;

}


export default function ProductCard(
{
    product

}: ProductCardProps
) {


return (

<article

className="product-card"

aria-label="Product card"

>


<div className="image-wrapper">


<img

src={
    product.image
        ? product.image
        : "https://via.placeholder.com/300"
}

alt={product.name}

loading="lazy"

/>


</div>



<div className="product-content">


<h2>

{product.name}

</h2>



<p>

{product.description || 
"No description available"}

</p>



<div className="price">

${product.price}

</div>



</div>


</article>

);

}