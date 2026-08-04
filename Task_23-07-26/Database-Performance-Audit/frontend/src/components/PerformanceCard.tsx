import type { PerformanceReport } from "../types";
import "../style/PerformanceCard.css";


interface Props {

    data: PerformanceReport;

}



function PerformanceCard({
    data
}: Props) {


    return (

        <div className="performance-card">


            <h2>
                Database Performance
            </h2>



            <div className="performance-content">


                <p className="performance-item">

                    <span>
                        Before Optimization:
                    </span>

                    <strong>
                        {data.before}
                    </strong>

                </p>



                <p className="performance-item">

                    <span>
                        After Optimization:
                    </span>

                    <strong>
                        {data.after}
                    </strong>

                </p>



                <p className="performance-item improvement">

                    <span>
                        Improvement:
                    </span>

                    <strong>
                        {data.improvement}
                    </strong>

                </p>



            </div>


        </div>

    );

}


export default PerformanceCard;