import WidgetErrorBoundary
from "../components/ErrorBoundary/WidgetErrorBoundary";

import "../style/dashboard.css";


const Dashboard = () => {


    return (

        <div className="dashboard-container">


            <h1 className="dashboard-title">

                Dashboard Page

            </h1>



            <div className="dashboard-grid">



                <WidgetErrorBoundary>


                    <div className="dashboard-card">


                        <h2>
                            Statistics
                        </h2>


                        <p>
                            Total Users: 100
                        </p>


                    </div>


                </WidgetErrorBoundary>





                <WidgetErrorBoundary>


                    <div className="dashboard-card">


                        <h2>
                            Analytics Chart
                        </h2>


                        <p>
                            Chart Loaded
                        </p>


                    </div>


                </WidgetErrorBoundary>



            </div>


        </div>

    );


};


export default Dashboard;