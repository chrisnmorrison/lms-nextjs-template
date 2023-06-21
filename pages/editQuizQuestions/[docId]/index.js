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

import QuizForm from "../../../components/editCourseContent/EditQuizQuestions";

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


  
  


  return (
    <>
      {/* <p>Course Code: {router.query.id}</p> */}
      <h1>Currenly editing: <strong>{courseContent.title}</strong></h1>
        

      <QuizForm documentId={documentId} type="Video" />
      
    </>
  );
}
