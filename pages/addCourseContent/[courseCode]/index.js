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
import TextForm from "../../../components/courseContent/AddCourseTextContent";
import QuizForm from "../../../components/courseContent/AddCourseQuizContent";
import VideoForm from "../../../components/courseContent/AddCourseVideoContent";

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
    case 'Text':
      formComponent = <TextForm onSubmit={handleSubmit} documentId={documentId} courseCode={course} />;
      break;
    case 'Video':
      formComponent = <VideoForm onSubmit={handleSubmit} documentId={documentId} courseCode={course} />;
      break;
    case 'Quiz':
      formComponent = <QuizForm onSubmit={handleSubmit} documentId={documentId} courseCode={course} />;
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
      <select id="options" value={selectedDropdown} onChange={handleDropdown} className="px-1 py-2 ml-2">
        <option value="" disabled selected>-- Select an Option --</option>
        <option value="Text">Text</option>
        <option value="Video">Video</option>
        <option value="Quiz">Quiz</option>
      </select>
      <p>Selected option: {selectedDropdown}</p>
       
       
        <ul>
          {courseContent.map((content) => (
            <li key={content.id}>{/* Render your course content data */}</li>
          ))}
        </ul>
        {formComponent}
      
      </div>
    </>
  );
}
