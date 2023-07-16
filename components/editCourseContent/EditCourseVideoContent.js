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
import { collection, doc, getDoc, } from "firebase/firestore";

const AddCourseVideoContent = ({ onSubmit, documentId, courseCode, type }) => {
  console.log(documentId);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [docToUpdateId, setDocToUpdateId] = useState(null);
  const [videoUpload, setVideoUpload] = useState(null);
  const [formData, setFormData] = useState({});
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState({});
  const [uploading, setUploading] = useState(false);
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const formDataCollection = collection(db, "courseContent");
        const docRef = doc(formDataCollection, documentId);
        const docSnapshot = await getDoc(docRef);

        if (docSnapshot.exists()) {
          const formData = docSnapshot.data();
    
          setDocToUpdateId(docSnapshot.id);
          setFormData(formData);
          console.log(formData);
        } else {
          console.log("Document not found");
          // Handle the case when the document does not exist
        }
      } catch (error) {
        console.error("Error retrieving course content:", error);
        throw error;
      }
    };

    fetchData();
  }, [documentId]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };


  //////////// For Modifying Current Questions ////////////
  const handleAddQuestion = () => {
    setQuestions((prevQuestions) => [
      ...prevQuestions,
      { question: "", answers: ["", "", "", ""], correctAnswer: null },
    ]);
  };

  const handleQuestionChange = (e, index) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].question = e.target.value;
    setQuestions(updatedQuestions);
    console.log(updatedQuestions);
  };

  const handleAnswerChange = (e, questionIndex, answerIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].answers[answerIndex] = e.target.value;
    setQuestions(updatedQuestions);
    console.log(updatedQuestions);
  };

  const handleCorrectAnswerChange = (e, index) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].correctAnswer = e.target.checked ? index : null;
    setQuestions(updatedQuestions);
    console.log(updatedQuestions);
  };

  //////////// For Adding New Question ////////////
  const handleAddNewQuestion = () => {
    setNewQuestion((prevQuestions) => [
      ...prevQuestions,
      { question: "", answers: ["", "", "", ""], correctAnswer: null },
    ]);
  };

  const handleNewQuestionChange = (e, index) => {
    const updatedQuestion = [...newQuestion];
    updatedQuestion[index].question = e.target.value;
    setNewQuestion(updatedQuestion);
    console.log(updatedQuestion);
  };

  const handleNewAnswerChange = (e, questionIndex, answerIndex) => {
    const updatedQuestion = [...questions];
    updatedQuestion[questionIndex].answers[answerIndex] = e.target.value;
    setNewQuestion(updatedQuestion);
    console.log(updatedQuestion);
  };

  const handleNewCorrectAnswerChange = (e, index) => {
    const updatedQuestion = [...questions];
    updatedQuestion[index].correctAnswer = e.target.checked ? index : null;
    setNewQuestion(updatedQuestion);
    console.log(updatedQuestion);
  };

  ////////////////////

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    let storageRef;
    let videoUrl = formData.videoUrl;
    console.log(videoUrl)
    if (videoUpload) {
      storageRef = ref(storage, `videos/${v4() + videoUpload.name}`);
      setUploading(true);
  
      try {
        await uploadBytes(storageRef, videoUpload);
        videoUrl = await getDownloadURL(storageRef);
        console.log(videoUrl);
      } catch (error) {
        console.error("Error uploading video:", error);
      } finally {
        setUploading(false);
      }
    }

    const updatedFormData = {
      ...formData,
      videoUrl: videoUrl,
    };
    console.log(updatedFormData);

    //console.log(jsonData);
    onSubmit(updatedFormData, docToUpdateId);
    router.push(`/courseContent/${formData.courseDocId}`);
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
    <form className="form-lg" onSubmit={handleFormSubmit}>
      <label className="" htmlFor="title">
        Title
      </label>
      <input
        defaultValue={formData.title}
        onChange={handleInputChange}
        className=""
        type="text"
        id="title"
        name="title"
        required
      />
      <label className=" mr-2 flex" htmlFor="contentOrder">
        Chapter{" "}
        <InfoIcon
          className="ml-2 text-grey-700"
          aria-describedby={id}
          variant="contained"
          onClick={handleClick}
        />
      </label>

      <input
        defaultValue={formData.contentOrder}
        onChange={handleInputChange}
        className=""
        type="text"
        id="contentOrder"
        name="contentOrder"
        required
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
        defaultValue={formData.due}
        onChange={handleInputChange}
        className=""
        type="datetime-local"
        name="due"
      />
      <label className="" htmlFor="open">
        App Users can see this content at the following date and time:
      </label>
      <input
        defaultValue={formData.open}
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
        defaultValue={formData.close}
        onChange={handleInputChange}
        className=""
        type="datetime-local"
        name="close"
      />
      <label className="mt-10" htmlFor="file">
        Video URL
      </label>
      <p className="text-gray-700">{formData.videoUrl}</p>
      <input
        type="file"
        name="file"
        id="file"
        className="sr-only"
        onChange={(e) => {
          setVideoUpload(e.target.files[0]);
        }}
      />
      <label
        htmlFor="file"
        id="videoFile"
        name="videoFile"
        className="relative flex min-h-[100px] items-center justify-center rounded-md border border-dashed border-[#e0e0e0] p-4 text-center"
      >
        <div>
          <span className="inline-flex rounded border border-[#e0e0e0] py-2 px-7 text-base font-medium text-[#07074D]">
            Browse
          </span>
          {videoUpload && <p className="text-black">{videoUpload.name}</p>}
        </div>
      </label>
      {uploading && (
        <span className="ml-2 text-black">
          Video is uploading, <strong>please do not navigate away from this page.</strong>
        </span>
      )}
      <p className="text-gray-700">
        <strong>
          * Note: Adding a new video DOES NOT delete the old video from storage!
        </strong>
      </p>
      
          
      <div className="mt-5">
        <Button className="btn" variant="contained" type="submit">
          Submit
        </Button>
      </div>
    </form>
  );
};

export default AddCourseVideoContent;
