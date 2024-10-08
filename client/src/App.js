import "./App.css";
import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import FileUpload from "./components/file-upload/file-upload.component";

function App() {
  const [newUserInfo, setNewUserInfo] = useState({
    profileImages: [],
  });
  const [downloadFilePath, setDownloadFilePath] = useState("");
  const updateUploadedFiles = (files) =>
    setNewUserInfo({ ...newUserInfo, profileImages: files });

  const handleSubmit = (event) => {
    event.preventDefault();
    //logic to create new user...
    if (newUserInfo.profileImages.length > 0) {
      sendData(newUserInfo.profileImages);
    } else {
      toast.error("Please select some receipts");
    }
  };

  const sendData = (files) => {
    const formData = new FormData();
    files.forEach((element) => {
      formData.append("files", element);
    });

    axios
      .post("http://localhost:5000/uploadmultiplereceipt/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        let text_color = { background: "#157347", text: "#FFFFFF" };
        toast.success("Data Saved Successfully!!!");
        setDownloadFilePath(response.data);
      })
      .catch((error) => {
        let text_color = { background: "#c82333", text: "#FFFFFF" };
        toast.error("There was an error saving data. Please try again later.");
      });
  };

  const getExcel = async () => {
    if (downloadFilePath) {
      try {
        let response = await axios.get(
          "http://localhost:5000/downloadexcel/" + downloadFilePath,
          { responseType: "blob" }
        );
        setNewUserInfo({ profileImages: [] });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.download = downloadFilePath; // Set the desired filename
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error("Error downloading Excel file:", error);
      }
    } else {
      toast.error("Please upload some receipts");
    }
  };
  return (
    <>
      <div className="App-header">
        <h1>SmartReceipts</h1>
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        ></ToastContainer>

        <form onSubmit={handleSubmit} encType="multipart/form/data">
          <FileUpload
            accept=".jpg,.png,.jpeg"
            label=""
            multiple
            updateFilesCb={updateUploadedFiles}
          />

          <div className="div-export-btn">
            <button type="submit" className="export-btn">
              Evaluate Receipts
            </button>

            <hr />

            <button
              type="button"
              className="export-btn"
              onClick={() => getExcel()}
            >
              Download as an Excel Sheet
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default App;
