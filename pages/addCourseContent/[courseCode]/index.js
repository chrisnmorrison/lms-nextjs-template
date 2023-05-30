import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import {
  doc,
query,
  collection,
  getDocs,
  getDoc,
  updateDoc,
  addDoc,
  where,
} from "firebase/firestore";
import { db } from "../../../firebase";
import TextForm from "../../../components/addCourseContent/AddCourseTextContent";
import QuizForm from "../../../components/addCourseContent/AddCourseQuizContent";
import VideoForm from "../../../components/addCourseContent/AddCourseVideoContent";

import {
  Button
} from "@mui/material";
import Link from "next/link";

export default function Page() {
  const [documentId, setDocumentId] = useState(null);
  const [data, setData] = useState(null);
  const [course, setCourse] = useState("");
  const [courseContent, setCourseContent] = useState([]);
  const [selectedDropdown, setSelectedDropdown] = useState("");
  const { name, code } = data || {};

  const router = useRouter();

  const handleDropdown = (event) => {
    setSelectedDropdown(event.target.value);
  };

  const handleSubmit = async (formData) => {
    try {
      // Add your logic here to handle form submission
      // For example, you can add the form data to the Firebase Firestore
      const { type } = formData;
      const docRef = await addDoc(collection(db, "courseContent"), formData);
      setCourse("");
  
      console.log("Form submitted successfully");
      // Optionally, you can redirect to a different page or perform other actions after form submission
    } catch (error) {
      console.error("Error submitting form:", error);
      // Handle the error accordingly
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const { courseCode } = router.query;
      setCourse(courseCode);

      try {
        const courseContentCollection = collection(db, "courseContent");
        const q = query(
          courseContentCollection,
          where("courseCode", "==", courseCode)
        );
        const querySnapshot = await getDocs(q);

        const courseContentData = [];
        querySnapshot.forEach((doc) => {
          courseContentData.push(doc.data());
        });

        setCourseContent(courseContentData);
      } catch (error) {
        console.error("Error retrieving course content:", error);
        throw error;
      }
    };

    fetchData();
  }, [router.query]);

  let formComponent = null;

  switch (selectedDropdown) {
    case 'text':
      formComponent = <TextForm onSubmit={handleSubmit} documentId={documentId} courseCode={course} type="Text" />;
      break;
    case 'video':
      formComponent = <VideoForm onSubmit={handleSubmit} documentId={documentId} courseCode={course} type="Video" />;
      break;
    case 'quiz':
      formComponent = <QuizForm onSubmit={handleSubmit} documentId={documentId} courseCode={course} type="Quiz" />;
      break;
    default:
      formComponent = null;
  }


  return (
    <>
      {/* <p>Course Code: {router.query.id}</p> */}
      <h1>Adding New Content for Course: <strong>{course}</strong></h1>
      <div className="">
        <label htmlFor="options">Select an option:</label>
      <select id="options" defaultValue={selectedDropdown} onChange={handleDropdown} className="px-1 py-2 ml-2">
        <option value="" disabled >-- Select an Option --</option>
        <option value="text">Text</option>
        <option value="video">Video</option>
        <option value="quiz">Quiz</option>
      </select>
       
   
        {formComponent}
      
      </div>
    </>
  );
}
