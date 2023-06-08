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
import TextForm from "../../../components/editCourseContent/EditCourseTextContent";
import QuizForm from "../../../components/editCourseContent/EditCourseQuizContent";
import VideoForm from "../../../components/editCourseContent/EditCourseVideoContent";

import {
  Button
} from "@mui/material";
import Link from "next/link";

export default function Page() {
  const [documentId, setDocumentId] = useState(null);
  const [course, setCourse] = useState("");
  const [courseContent, setCourseContent] = useState([]);
  const [selectedDropdown, setSelectedDropdown] = useState("");

  const router = useRouter();

  const handleDropdown = (event) => {
    setSelectedDropdown(event.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      const { docId } = router.query;
      console.log(docId)
      setDocumentId(docId);
  
      try {
        const courseContentCollection = collection(db, "courseContent");
        const docRef = doc(courseContentCollection, docId);
        const docSnapshot = await getDoc(docRef);
  
        if (docSnapshot.exists()) {
          const courseContentData = docSnapshot.data();
          setCourseContent(courseContentData);
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
  }, [router.query]);

  const handleSubmit = async (formData, docToUpdateId) => {
    try {
      const docRef = doc(db, "courseContent", docToUpdateId);
      await updateDoc(docRef, formData);
  
      console.log("Form submitted successfully");
      // Optionally, you can redirect to a different page or perform other actions after form submission
    } catch (error) {
      console.error("Error submitting form:", error);
      // Handle the error accordingly
    }
  };
  
  
  

  let formComponent = null;

  switch (courseContent.type) {
    case 'text':
      formComponent = <TextForm onSubmit={handleSubmit} documentId={documentId} type="Text" />;
      break;
    case 'video':
      formComponent = <VideoForm onSubmit={handleSubmit} documentId={documentId} type="Video" />;
      break;
    case 'quiz':
      formComponent = <QuizForm onSubmit={handleSubmit} documentId={documentId} type="Quiz" />;
      break;
    default:
      formComponent = null;
  }


  return (
    <>
      {/* <p>Course Code: {router.query.id}</p> */}
      <h1>Currenly editing: <strong>{courseContent.title}</strong></h1>
        

        {formComponent}
      
    </>
  );
}
