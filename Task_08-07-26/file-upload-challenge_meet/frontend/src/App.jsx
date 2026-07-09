import SimpleUpload from "./components/SimpleUpload.jsx";
import ChunkedUpload from "./components/ChunkedUpload.jsx";
import "./styles.css";

export default function App() {
  return (
    <div className="app">
      <h1>File Upload System</h1>
      <SimpleUpload />
      <ChunkedUpload />
    </div>
  );
}
