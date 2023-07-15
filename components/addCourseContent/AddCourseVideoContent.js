"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import { storage, db } from "../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/router";
import { v4 } from "uuid";

let textAreaValue = "";

const AddCourseVideoContent = ({ onSubmit, documentId, type }) => {
  console.log(documentId);
  const [formData, setFormData] = useState({});
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [videoUpload, setVideoUpload] = useState(null);

  const router = useRouter();

  useEffect(() => {
    // Initialize the courseCode field with the value of courseCode
    setFormData((prevFormData) => ({
      ...prevFormData,
      courseDocId: documentId,
      type: "video",
    }));
    console.log(formData);
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (videoUpload === null) {
      return;
    }

    const storageRef = ref(storage, `videos/${v4() + videoUpload.name}`);
    await uploadBytes(storageRef, videoUpload);

    const videoUrl = await getDownloadURL(storageRef);
    console.log(videoUrl);

    const updatedFormData = {
      ...formData,
      videoUrl: videoUrl,
    };
    console.log(updatedFormData);

    //console.log(jsonData);
    onSubmit(updatedFormData);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
    // console.log(formData);
  };

  return (
    <form className="form-lg" onSubmit={handleFormSubmit}>
      <label className="" htmlFor="title">
        Title
      </label>
      <input
        onChange={handleInputChange}
        className=""
        type="text"
        id="title"
        name="title"
        required
      />
      <label className=" mr-2 flex" htmlFor="contentOrder">
        Chapter
      </label>

      <input
        onChange={handleInputChange}
        className=""
        type="text"
        id="contentOrder"
        name="contentOrder"
        required
      />
      <InfoIcon
        className="ml-2"
        aria-describedby={id}
        variant="contained"
        onClick={handleClick}
      />

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Typography sx={{ p: 2 }}>
          <p>
            The numerical order that content is displayed in the app, similar to
            book chapters.
          </p>{" "}
          <p>
            For example, these numberings would be displayed in order from
            smallest to largest:
          </p>{" "}
          <p>1.0, 1.1, 1.2, 2.0, 3.0, 3.1, etc.</p>
        </Typography>
      </Popover>
      <label className="" htmlFor="due">
        Due Date/Time
      </label>
      <input
        onChange={handleInputChange}
        className=""
        type="datetime-local"
        name="due"
      />
      <label className="" htmlFor="open">
        App Users can see this content at the following date and time:
      </label>
      <input
        onChange={handleInputChange}
        className=""
        type="datetime-local"
        name="open"
      />
      <label className="" htmlFor="close">
        At the following date and time, app users will no longer have access to
        this content:
      </label>
      <input
        onChange={handleInputChange}
        className=""
        type="datetime-local"
        name="close"
      />
      <label className="mt-10" htmlFor="file">
        Video Upload
      </label>
      <input type="file" name="file" id="file" className="sr-only" 
      onChange={(e) => {setVideoUpload(e.target.files[0]);
        }}
      />
      <label htmlFor="file" id="videoFile" name="videoFile" className="relative flex min-h-[100px] items-center justify-center rounded-md border border-dashed border-[#e0e0e0] p-4 text-center"
      >
        <div>
          <span className="inline-flex rounded border border-[#e0e0e0] py-2 px-7 text-base font-medium text-[#07074D]">
            Browse
          </span>
          {videoUpload && <p className="text-black">{videoUpload.name}</p>}
        </div>
      </label>

      <div className="mt-5">
        <Button variant="contained" type="submit" className="btn">
          Submit
        </Button>
      </div>
    </form>
  );
};

export default AddCourseVideoContent;
