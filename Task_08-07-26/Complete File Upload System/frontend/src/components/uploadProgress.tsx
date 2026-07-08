interface Props {
  progress: number;
}

const UploadProgress = ({ progress }: Props) => {
  return (
    <div
      style={{
        marginTop: "20px",
      }}
    >
      <h3>Upload Progress</h3>

      <progress
        value={progress}
        max={100}
        style={{
          width: "100%",
          height: "20px",
        }}
      />

      <p>{progress}%</p>
    </div>
  );
};

export default UploadProgress;