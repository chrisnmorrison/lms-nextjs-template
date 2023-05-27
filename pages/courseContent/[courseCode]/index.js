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

  return (
    <>
      {/* <p>Course Code: {router.query.id}</p> */}
      <h1>Course ID: {course}</h1>
      <div className="flex">
        <ul>
          {courseContent.map((content) => (
           
            <li key={content.id}>{JSON.stringify(content)}</li>
          ))}
        </ul>

        <div className="mt-5">
          <Link href={`/addCourseContent/${course}`}> <Button variant="contained" type="submit">
            Add New Content
          </Button></Link>
         
        </div>
      </div>
    </>
  );
}
