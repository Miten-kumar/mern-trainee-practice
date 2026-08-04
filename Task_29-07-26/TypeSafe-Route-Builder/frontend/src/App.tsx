import AppRoutes from "./routes/app.routes";

import Navbar from "./components/Navbar";


function App() {


    return (

        <>

            <Navbar />


            <main>

                <AppRoutes />

            </main>


        </>

    );

}


export default App;