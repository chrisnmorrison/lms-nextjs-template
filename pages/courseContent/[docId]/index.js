import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import {
  doc,
  setDoc,
  deleteField,
  addDoc,
  collection,
  deleteDoc,
  getDocs,
  getDoc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../../firebase";
import useFetchCourses from "../../../hooks/fetchCourses";
import { Button } from "@mui/material";
import { startCase } from "lodash";
import Link from "next/link";

export default function Page() {
  const [documentId, setDocumentId] = useState(null);
  const [data, setData] = useState(null);
  const [course, setCourse] = useState("");
  const [courseContent, setCourseContent] = useState([]);

  const router = useRouter();
  const docId = router.query.docId;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const courseContentCollection = collection(db, "courseContent");
        const q = query(
          courseContentCollection,
          where("courseDocId", "==", docId)
        );
        const querySnapshot = await getDocs(q);

        const courseContentData = [];
        querySnapshot.forEach((doc) => {
          courseContentData.push({ id: doc.id, ...doc.data() });
        });
        courseContentData.sort((a, b) => a.contentOrder - b.contentOrder);
        setCourseContent(courseContentData);
      } catch (error) {
        console.error("Error retrieving course content:", error);
        throw error;
      }
    };

    fetchData();
  }, [docId]);

  const handleDelete = async (contentId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this content?\n\nDeleting content will move it to Archived Course Content."
    );
    if (confirmDelete) {
      try {
        // Get a reference to the document to be deleted
        const courseDocRef = doc(db, "courseContent", contentId);

        // Get the data of the document before deleting it
        const courseSnapshot = await getDoc(courseDocRef);
        const courseData = courseSnapshot.data();

        // Add the document to the archivedCourses collection
        const archivedContentCollection = collection(
          db,
          "archivedCourseContent"
        );
        await addDoc(archivedContentCollection, courseData);

        // Delete the document from the current collection
        await deleteDoc(courseDocRef);

        setCourseContent((prevCourseContent) =>
          prevCourseContent.filter((content) => content.id !== contentId)
        );

        // Perform any additional actions after successful deletion
        console.log("Content moved to archives");
      } catch (error) {
        console.error("Error deleting content:", error);
        // Handle error and display an error message to the user
      }
    }
  };

  const formatDate = (dateString) => {
    const timestamp = Date.parse(dateString);

    // if is invalid
    if (isNaN(timestamp)) {
      return "Invalid date format";
    }

    const date = new Date(dateString);

    // Extract the date components
    const year = date.getFullYear();
    const month = date.toLocaleString("default", { month: "long" });
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();

    // Format the date string
    const formattedDate = `${month} ${day}, ${year} ${hours}:${minutes}`;

    return formattedDate;
  };

  return (
    <>
      {/* <p>Course Code: {router.query.id}</p> */}
      {/* <h1>Course ID: {course}</h1> */}
      <div className="">
        <table className="table-dark">
          <thead>
            <tr>
              <th>Content Order</th>
              <th>Title</th>
              <th>Type</th>
              <th>Due at</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courseContent.map((content) => (
              
              <tr key={content.title}>
                
                <td>{content.contentOrder}</td>
                <td>{content.title}</td>
                <td>{startCase(content.type)}</td>
                <td>{formatDate(content.due)}</td>
                <td className="flex">
                  {content.type == "video" ? (
                    <Link href={`${course}/editTimestamps/${content.id}`}>
                      <Button size="small"
                        sx={{ mr: 0.5, ml: 0.5 }}
                        variant="contained"
                        color="success"
                      >
                        Edit Video Questions
                      </Button>
                    </Link>
                  ) : null}
                  {content.type == "quiz" ? (
                    <Link href={`${course}/editQuizQuestions/${content.id}`}>
                      <Button size="small"
                        sx={{ mr: 0.5, ml: 0.5 }}
                        variant="contained"
                        color="success"
                      >
                        Edit Quiz Questions
                      </Button>
                    </Link>
                  ) : null}

                  <Link href={`${course}/editCourseContent/${content.id}`}>
                    <Button size="small" sx={{ mr: 0.5, ml: 0.5 }} variant="contained">
                      Edit Content
                    </Button>
                  </Link>
                  <Button size="small"
                    sx={{ ml: 0.5 }}
                    color="error"
                    variant="contained"
                    onClick={() => handleDelete(content.id)} // Pass the courseKey as an argument
                  >
                    Delete Content
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-5">
          <Link href={`/addCourseContent/${docId}`}>
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
