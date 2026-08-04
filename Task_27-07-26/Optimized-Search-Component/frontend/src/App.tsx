import SearchBox from "./components/SearchBox";
import "./index.css";


function App() {


  return (

    <div className="app-container">


      <h1>
        Optimized Search Component
      </h1>


      <p className="subtitle">
        Search products with autocomplete,
        debounce and request cancellation
      </p>



      <SearchBox />


    </div>

  );

}


export default App;