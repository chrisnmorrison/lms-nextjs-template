import { useRouter } from "next/router";

import React, { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import {
  doc,
  setDoc,
  deleteField,
  addDoc,
  collection,
  getDocs,
  getDoc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../../firebase";
import useFetchCourses from "../../../hooks/fetchCourses";
import { Button } from "@mui/material";
import Link from "next/link";

export default function Page() {
    const [documentId, setDocumentId] = useState(null);
  const [data, setData] = useState(null);
  const [course, setCourse] = useState("");
  const [courseContent, setCourseContent] = useState([]);
  const { name, code } = data || {};
    

  const router = useRouter();
  const  docId  = router.query.docId;

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const documentRef = doc(db, 'courseContent', docId);
        const documentSnapshot = await getDoc(documentRef);

        if (documentSnapshot.exists()) {
          const documentData = documentSnapshot.data();
          setCourseContent(documentData);
        } else {
          console.log('Document not found');
          // Handle document not found case
        }
      } catch (error) {
        console.error('Error retrieving document:', error);
        // Handle error case
      }
    };

    fetchDocument();
  }, [docId]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Handle the form submission logic here
    // You can access the form field values using event.target

    // Example code:

    const updatedDocument = {
      name: event.target.courseName.value,
      code: event.target.courseCode.value,
      description: event.target.courseDescription.value,
    };

    const docToUpdate = doc(db, "courses", documentId);
    await updateDoc(docToUpdate, updatedDocument);

    // Do something with the updated form values
    console.log(updatedDocument);

    router.push("/courses");
  };

  

  return (
    <>
      {/* <p>Course Code: {router.query.id}</p> */}
      <h1>Course Content ID: {JSON.stringify(courseContent)}</h1>
      <div className="">
       <h2>Title: {courseContent.title}</h2>

        <div className="mt-5">
        <Button variant="contained" type="submit">
            Submit
          </Button>
         
        </div>
      </div>
    </>
  );
}

