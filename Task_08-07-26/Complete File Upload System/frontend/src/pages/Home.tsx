import { useState } from "react";

import FileUpload from "../components/fileUpload";
import UploadProgress from "../components/uploadProgress";
import FileList from "../components/fileList";

const Home = () => {
  const [progress, setProgress] = useState(0);
  const [refresh, setRefresh] = useState(false);

  const handleUploadSuccess = () => {
    setRefresh((prev) => !prev);
    setProgress(100);

    setTimeout(() => {
      setProgress(0);
    }, 1000);
  };

  return (
    <div className="container">
      <h1>Complete File Upload System</h1>

      <p>
        Upload multiple files with validation, progress tracking,
        image compression and download support.
      </p>

      <FileUpload
        onUploadSuccess={handleUploadSuccess}
        onProgress={setProgress}
      />

      <UploadProgress progress={progress} />

      <FileList refresh={refresh} />
    </div>
  );
};

export default Home;