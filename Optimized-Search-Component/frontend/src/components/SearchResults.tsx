import HighlightText from "./HighLightText";
import type { Product } from "../types/search.types";


interface Props {

    products: Product[];

    query: string;

    activeIndex:number;

}

export default function SearchResults({

    products,

    query,

    activeIndex

}: Props){

    return (

        <div className="results-dropdown">

            {
                products.map(

                    (product,index)=>(


                    <div

                        key={product.id}

                        className={
                            index === activeIndex
                            ?
                            "active-result"
                            :
                            "result-item"
                        }

                    >

                        <h4>

                        <HighlightText

                            text={product.name}

                            highlight={query}

                        />

                        </h4>

                        <p>
                            {product.category}
                        </p>

                    </div>

                    )
                )
            }

        </div>

    );

}