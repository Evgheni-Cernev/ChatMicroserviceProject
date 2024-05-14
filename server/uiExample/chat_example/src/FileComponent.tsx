import React from "react";

interface FileComponentProps {
  fileName: string;
}

const FileComponent: React.FC<FileComponentProps> = ({ fileName }) => {
  const downloadFile = () => {
    fetch(`http://localhost:3003/messages/file/${fileName}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to download file");
        }
        return response.blob();
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
      })
      .catch((error) => console.error("Error downloading file:", error));
  };

  return (
    <div>
      <button onClick={downloadFile}>Download {fileName}</button>
    </div>
  );
};

export default FileComponent;
