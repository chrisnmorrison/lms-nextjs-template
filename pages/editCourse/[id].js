import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
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
import { db } from "../../firebase";
import useFetchCourses from "../../hooks/fetchCourses";
import { Button } from "@mui/material";

export default function Page({ documentId, data }) {
  const [course, setCourse] = useState([]);
  const { name, code } = document;

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

  return (
    <>
      {/* <p>Course Code: {router.query.id}</p> */}
      <h1 className="lg-title mb-5">Edit Course</h1>
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
            defaultValue={data.name}
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
            defaultValue={data.code}
          />
        </div>
        <div>
          <label
            className="block text-white-700 text-lg font-bold mb-2"
            htmlFor="courseCode"
          >
            Course Code:
          </label>
          <textarea
            rows={5}
            className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            id="courseDescription"
            name="courseDescription"
            required
            defaultValue={data.description}
          />
        </div>
        <div className="mt-5">
          <Button variant="contained" type="submit">
            Submit
          </Button>
        </div>
      </form>
    </>
  );
}

export const getServerSideProps = async (context) => {
  const { id } = context.query;
  try {
    const coursesCollection = collection(db, "courses");
    const querySnapshot = await getDocs(coursesCollection);
    let documentId = null;
    let document = null;
    let data = null;

    querySnapshot.forEach((doc) => {
      const data = doc.data();

      if (data.code === id) {
        documentId = doc.id;
        document = doc;
      }
    });
    const docRef = doc(db, "courses", documentId);

    const docSnapshot = await getDoc(docRef);
    if (docSnapshot.exists()) {
      data = docSnapshot.data();
    }
    return { props: { documentId, data } };
  } catch (error) {
    console.error("Error retrieving document ID:", error);
    throw error;
  }
};
