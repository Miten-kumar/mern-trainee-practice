interface Props {

    text:string;

    highlight:string;

}



export default function HighlightText({

    text,

    highlight

}:Props){



    if(!highlight){

        return <>{text}</>;

    }



    const parts =
        text.split(

            new RegExp(
                `(${highlight})`,
                "gi"
            )

        );



    return (

        <>

        {

            parts.map(

                (part,index)=>(


                    part.toLowerCase()
                    ===
                    highlight.toLowerCase()

                    ?

                    <strong key={index}>
                        {part}
                    </strong>


                    :

                    part


                )

            )

        }

        </>

    );


}