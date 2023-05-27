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
} from "firebase/firestore";
import { db } from "../../../firebase";
import useFetchCourses from "../../../hooks/fetchCourses";
import { Button } from "@mui/material";
import Link from "next/link";

export default function Page() {
  const [documentId, setDocumentId] = useState(null);
  const [data, setData] = useState(null);
  const [course, setCourse] = useState("");
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
        const coursesCollection = collection(db, "courses");
        const querySnapshot = await getDocs(coursesCollection);

        querySnapshot.forEach((doc) => {
          const docData = doc.data();

          if (docData.code === courseCode) {
            setDocumentId(doc.id);
            setData(docData);
          }
        });
      } catch (error) {
        console.error("Error retrieving document ID:", error);
        throw error;
      }
    };

    fetchData();
  }, [router.query]);

  return (
    <>
      {/* <p>Course Code: {router.query.id}</p> */}
      <h1 className="lg-title mb-5">Edit Course Information</h1>
      <div className="flex">
        {" "}
        <div className="flex-1">
          <form id="editCourseForm" onSubmit={handleSubmit}>
            <div>
              <label
                className="block text-white-700 text-lg font-bold mb-2"
                htmlFor="courseName"
              >
                CourseName
              </label>{" "}
              <input
                className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                id="courseName"
                name="courseName"
                required
                defaultValue={name}
              />
            </div>
            <div>
              <label
                className="block text-white-700 text-lg font-bold mb-2"
                htmlFor="courseCode"
              >
                Course Code:
              </label>
              <input
                className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                id="courseCode"
                name="courseCode"
                required
                defaultValue={code}
              />
            </div>
            <div>
              <label
                className="block text-white-700 text-lg font-bold mb-2"
                htmlFor="courseCode"
              >
                Course Description:
              </label>
              <textarea
                rows={5}
                className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                id="courseDescription"
                name="courseDescription"
                required
                defaultValue={data?.description}
              />
            </div>
            <div className="mt-5">
              <Button variant="contained" type="submit">
                Submit
              </Button>
            </div>
          </form>
        </div>
        <div className="flex-1">
          <p className='pb-5'>Use this link to edit course content (learning material, videos, etc.)</p>
          <Link href={`/courseContent/${course}`}>
           
            <Button  variant="contained" color='success'>
              Edit Course Content
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}
