import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import CourseCard from "./CourseCard";
import {
  doc,
  setDoc,
  deleteField,
  getDoc,
  addDoc,
  collection,
} from "firebase/firestore";
import { db } from "../firebase";
import useFetchCourses from "../hooks/fetchCourses";
import { Link } from "@mui/material";
import { Button } from "@mui/material";

export default function UserDashboard() {
  const { userInfo, currentUser } = useAuth();
  const [edit, setEdit] = useState(null);
  const [course, setCourse] = useState([]);
  const [edittedValue, setEdittedValue] = useState("");

  const { courses, isLoading, isError } = useFetchCourses();
 

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
    <div className="w-full  text-xs sm:text-sm mx-auto flex flex-col flex-1 gap-3 sm:gap-5">
      <div className="flex items-center">
        <h1 className="text-3xl">Course List</h1>
      </div>
      {isLoading && (
        <div className="flex-1 grid place-items-center">
          <i className="fa-solid fa-spinner animate-spin text-6xl"></i>
        </div>
      )}
      <div className="current-courses">
        {!isLoading && (
          <>
            <table className="table-dark">
          <thead>
            <tr>
              <th>Name</th>
              <th>Code</th>
              <th>Semester</th>
              <th>Year</th>
              <th>Location</th>
              <th>Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((content) => (
              <tr key={content.name + content.code + content.semester + content.year}>
                <td>{content.name}</td>
                <td>{content.code}</td>
                <td>{content.semester}</td>
                <td>{content.year}</td>
                <td>{content.location}</td>
                <td>{content.time}</td>
                <td className="flex">
                  <Link href={`/courseContent/${content.code}` }>
                    <Button sx={{ mr: 0.5 }} variant="contained">
                      Edit Content
                    </Button>
                  </Link>
                  <Button
                    sx={{ ml: 0.5 }}
                    color="error"
                    variant="contained"
                    onClick={() => handleDelete(content.id)} // Pass the courseKey as an argument
                  >
                    Delete Course
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
           
            <div className="mt-5">
              <Link
                href="/AddCourse"
                underline="hover"
                style={{ fontSize: "200%", marginBottom: ".5rem" }}
              >
                <Button size="large" variant="outlined">
                  Add New Course
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
      {/* {!addCourse && <button onClick={() => setAddCourse(true)} className='text-cyan-300 border border-solid border-cyan-300 py-2 text-center uppercase text-lg duration-300 hover:opacity-30'>ADD COURSE</button>} */}
    </div>
  );
}

export const GetServerSideProps = () => {};
