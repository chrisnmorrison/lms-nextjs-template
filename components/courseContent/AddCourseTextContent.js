'use client'

import React, { useState, useEffect} from "react";
import Link from "next/link";
import { Button } from "@mui/material";
import FormHtmlEditor from "./FormHtmlEditor";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import dynamic from "next/dynamic";
import InfoIcon from "@mui/icons-material/Info";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";

const AddCourseTextContent = ({ onSubmit, documentId, courseCode }) => {
  console.log(courseCode)
  const [formData, setFormData] = useState({});
  const [textContent, setTextContent] = useState("");
  const [anchorEl, setAnchorEl] = React.useState(null);

  useEffect(() => {
    // Initialize the courseCode field with the value of courseCode
    setFormData((prevFormData) => ({
      ...prevFormData,
      courseCode: courseCode,
    }));
    console.log(formData)
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;


  const handleTextContentChange = (value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      textContent: value,
    }));
    setTextContent(value);
    console.log(textContent)
  };

  const handleFormSubmit = (event) => {
    console.log("In form data.")
    event.preventDefault();
    setFormData((prevFormData) => ({
      ...prevFormData,
      textContent: textContent,
    }));
    const jsonData = JSON.stringify(formData);

    console.log(jsonData);
    onSubmit(formData); // Call the onSubmit callback with the form data
    setFormData(""); // Clear the form data after submission
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
    console.log(formData);
  };
 
  return (
    <form onSubmit={handleFormSubmit}>
      <label
        className="block text-white-700 text-lg font-bold mb-2"
        htmlFor="title"
      >
        Title
      </label>
      <input  onChange={handleInputChange}
        className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        type="text"
        id="title"
        name="title"
        required
      />
      <label
        className="block text-white-700 text-lg font-bold mb-2 mr-2 flex"
        htmlFor="contentOrder"
      >
       Chapter
      </label>

      <input  onChange={handleInputChange}
        className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        type="text"
        id="contentOrder"
        name="contentOrder"
        required
      />
      <InfoIcon className="ml-2"
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
        <Typography sx={{ p: 2 }}><p>The numerical order that content is displayed in the app, similar to book chapters.</p> <p>For example, these numberings would be displayed in order from smallest to largest:</p> <p>1.0, 1.1, 1.2, 2.0, 3.0, 3.1, etc.</p></Typography>
      </Popover>
      <label
        className="block text-white-700 text-lg font-bold mb-2"
        htmlFor="due"
      >
        Due Date/Time
      </label>
      <input  onChange={handleInputChange}
        className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        type="datetime-local"
        name="due"
      />
       <label
        className="block text-white-700 text-lg font-bold mb-2"
        htmlFor="open"
      >
        App Users can see this content at the following date and time:
      </label>
      <input  onChange={handleInputChange}
        className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        type="datetime-local"
        name="open"
      />
       <label
        className="block text-white-700 text-lg font-bold mb-2"
        htmlFor="close"
      >
        At the following date and time, app users will no longer have access to this content:

      </label>
      <input  onChange={handleInputChange}
        className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        type="datetime-local"
        name="close"
      />
      <label
        className="block text-white-700 text-lg font-bold mb-2"
        htmlFor="textContent"
      >
        Text Content
      </label>

      <ReactQuill theme="snow" value={textContent} onChange={handleTextContentChange} />
      <div className="mt-5">
          <Button variant="contained" type="submit">
            Submit
          </Button>
      </div>
    </form>
  );
};

export default AddCourseTextContent;
