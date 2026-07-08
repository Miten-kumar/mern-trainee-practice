import { useEffect, useState } from "react";
import api from "../services/api";
import type { UploadedFile } from "../types/File";

interface Props {
  refresh: boolean;
}

const FileList = ({ refresh }: Props) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);

  const loadFiles = async () => {
    try {
      const res = await api.get("/upload");

      setFiles(res.data.files || []);
    } catch (error) {
      console.error(error);
      setFiles([]);
    }
  };

  useEffect(() => {
    loadFiles();
  }, [refresh]);

  return (
    <div style={{ marginTop: "30px" }}>
      <h2>Uploaded Files</h2>

      {files.length === 0 ? (
        <p>No Files Uploaded</p>
      ) : (
        <table
          border={1}
          cellPadding={10}
          width="100%"
        >
          <thead>
            <tr>
              <th>ID</th>
              <th>File Name</th>
              <th>Download</th>
            </tr>
          </thead>

          <tbody>
            {files.map((file) => (
              <tr key={file.id}>
                <td>{file.id}</td>

                <td>{file.name}</td>

                <td>
                  <a
                    href={`http://localhost:3001/uploads/${file.name}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Download
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default FileList;