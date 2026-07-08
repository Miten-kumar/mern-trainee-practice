import { useState } from "react";
import api from "../services/api";

interface Props {
  onUploadSuccess: () => void;
  onProgress: (value: number) => void;
}

const FileUpload = ({ onUploadSuccess, onProgress }: Props) => {
  const [files, setFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setFiles(e.dataTransfer.files);
  };

  const handleUpload = async () => {
    if (!files) {
      alert("Please select files.");
      return;
    }

    const formData = new FormData();

    Array.from(files).forEach((file) => {
      formData.append("files", file);
    });

    try {
      setLoading(true);

      await api.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },

        onUploadProgress: (event) => {
          if (event.total) {
            const progress = Math.round(
              (event.loaded * 100) / event.total
            );

            onProgress(progress);
          }
        },
      });

      alert("Files Uploaded Successfully");

      onUploadSuccess();

      setTimeout(() => {
        onProgress(0);
      }, 1000);
    } catch (error) {
      console.error(error);
      alert("Upload Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        style={{
          border: "2px dashed gray",
          padding: "30px",
          textAlign: "center",
          marginBottom: "20px",
        }}
      >
        Drag & Drop Files Here
      </div>

      <input
        type="file"
        multiple
        onChange={handleChange}
      />

      <br />
      <br />

      <button
        onClick={handleUpload}
        disabled={loading}
      >
        {loading ? "Uploading..." : "Upload Files"}
      </button>

    </div>
  );
};

export default FileUpload;