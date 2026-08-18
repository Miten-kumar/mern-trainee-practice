import ProductCard 
from "../components/productCard";


import ProductSkeleton 
from "../components/productSkeleton";


import Loader 
from "../components/Loader";


import ErrorMessage 
from "../components/ErrorMessage";


import {
    useInfiniteProducts
} from "../hooks/useInfiniteProducts";


import {
    useIntersectionObserver
} from "../hooks/useIntersectionObserver";


import {
    useScrollRestoration
} from "../hooks/useScrollRestoration";


import "../style/Products.css";



export default function Products(){


const {

    data,

    fetchNextPage,

    hasNextPage,

    isFetchingNextPage,

    isLoading,

    isError,

    refetch


}=useInfiniteProducts();



useScrollRestoration();



const loaderRef =
useIntersectionObserver(()=>{


    if(
        hasNextPage &&
        !isFetchingNextPage
    ){

        fetchNextPage();

    }


});



if(isLoading){


return (

<div className="product-container">

<div className="product-grid">

<ProductSkeleton/>

<ProductSkeleton/>

<ProductSkeleton/>

</div>

</div>

);


}



if(isError){


return (

<ErrorMessage

message="Unable to load products"

retry={refetch}

/>

);


}



return (

<main

className="product-container"

aria-label="Product list"

>


<h1 className="product-title">

Products

</h1>



<section className="product-grid">


{

data?.pages.map((page)=>(


page.products.map((product)=>(


<ProductCard

key={product.id}

product={product}

/>


))


))


}


</section>




<div

ref={loaderRef}

className="scroll-loader"

aria-live="polite"

>


{

isFetchingNextPage &&

<Loader/>

}



{

!hasNextPage &&

<p className="end-message">

No more products available

</p>

}



</div>



</main>

);


}