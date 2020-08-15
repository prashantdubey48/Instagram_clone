import React, { useState } from "react";
import { Button } from "@material-ui/core";
import { storage, db } from "./firebase";
import firebase from "firebase";
import './imageUpload.css'

function ImageUpload(props) {
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [caption, setCaption] = useState("");

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };
  const handleUpload = () => {
    const uploadTask = storage.ref(`/images/${image.name}`).put(image)
  

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // progress function

        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      //// error functiom
      (error) => {
        alert(error.message);
      },
      /// complete function
      () => {
        storage
          .ref("images")
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            db.collection("post").add({
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              caption: caption,
              imageUrl: url,
              username: "prashant",
            });
            setProgress(0);
            setCaption("");
            setImage(null);


          });
      }
    );
  };

  return (
    <div className="imageUpload">
      <progress value={progress} max="100" className='imageUpload_progress' />
      <input
        type="text"
        placeholder="Enter a Caption...."
        onChange={(e) => setCaption(e.target.value)}
      />
      <input type="file" onChange={handleChange} />
      <Button onClick={handleUpload}>Upload</Button>
    </div>
  );
}

export default ImageUpload;
