import {
    useEffect,
    useState
} from "react";


import "../style/Dashboard.css";


import PerformanceCard 
from "../components/PerformanceCard";


import UserList 
from "../components/UserList";


import {
    getPerformance
} from "../services/performanceService";


import type {
    PerformanceReport
} from "../types";



function Dashboard() {


    const [performance, setPerformance] =
        useState<PerformanceReport | null>(null);



    useEffect(() => {


        // eslint-disable-next-line react-hooks/immutability
        loadPerformance();


    }, []);




    const loadPerformance = async () => {


        try {


            const data =
            await getPerformance();


            setPerformance(data);


        } catch (error) {


            console.log(
                "Performance API Error",
                error
            );


        }


    };



    return (

        <div className="dashboard">


            <h1 className="dashboard-title">

                Database Performance Audit Dashboard

            </h1>




            <div className="dashboard-grid">


                {
                    performance &&

                    <PerformanceCard
                        data={performance}
                    />

                }



                <UserList />


            </div>


        </div>

    );

}



export default Dashboard;