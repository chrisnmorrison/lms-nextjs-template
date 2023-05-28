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

  function handleAddEdit(courseKey) {
    return () => {
      console.log(courses[courseKey]);
      setEdit(courseKey);
      setEdittedValue(courses[courseKey]);
    };
  }

  const handleDelete = async (courseKey) => {
    console.log(courseKey);
    try {
      // Get a reference to the document to be deleted
      const courseDocRef = doc(db, "courses", courseKey);

      // Get the data of the document before deleting it
      const courseSnapshot = await getDoc(courseDocRef);
      const courseData = courseSnapshot.data();

      // Delete the document from the current collection
      await deleteDoc(courseDocRef);

      // Add the document to the archivedCourses collection
      const archivedCoursesCollection = collection(db, "archivedCourses");
      await addDoc(archivedCoursesCollection, courseData);

      // Perform any additional actions after successful deletion
      console.log("Course moved to archives");
    } catch (error) {
      console.error("Error deleting course:", error);
      // Handle error and display an error message to the user
    }
  };

  return (
    <>
      {/* <p>Course Code: {router.query.id}</p> */}
      <h1>Course ID: {course}</h1>
      <div className="">
       <table className="table-dark">
  <thead>
    <tr>
      <th>Content Order</th>
      <th>Title</th>
      <th>Type</th>
      <th>Opens At</th>
      <th>Due at</th>
      <th>Closes at</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    {courseContent.map((content) => (
      <tr key={content.id}>
        <td>{content.contentOrder}</td>
        <td>{content.title}</td>
        <td>{content.type}</td>
        <td>{content.open}</td>
        <td>{content.due}</td>
        <td>{content.close}</td>
        <td className="flex">
          <Link href={`editCourse/${content.courseCode}`}>
            <Button sx={{ mr: 0.5 }} variant="contained">
              Edit Content
            </Button>
          </Link>
          <Link href="">
            <Button
              sx={{ ml: 0.5 }}
              color="error"
              variant="contained"
              onClick={handleDelete}
            >
              Delete Course
            </Button>
          </Link>
        </td>
      </tr>
    ))}
  </tbody>
</table>

        <div className="mt-5">
          <Link href={`/addCourseContent/${course}`}>
            {" "}
            <Button variant="contained" type="submit">
              Add New Content
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}
