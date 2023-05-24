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
  query,
  where
} from "firebase/firestore";
import { db } from "../../firebase";
import useFetchCourses from "../../hooks/fetchCourses";
import { Button } from "@mui/material";

export default function Page({ data }) {
  const [user, setUser] = useState([]);
  const { title, userUrl } = document;

  const router = useRouter();
  const { id } = router.query;

  const handleSubmit = async (event) => {
    event.preventDefault();

  const updatedUserTimestamps = [];
  for (let i = 0; i < user.length; i++) {
    const timestamp = event.target[`userTimestamp${i}`].value;
    updatedUserTimestamps.push(timestamp);
  }

  const updatedDocument = {
    name: event.target.userName.value,
    code: event.target.userCode.value,
    description: event.target.userDescription.value,
    userTimestamps: updatedUserTimestamps,
  };

    const docToUpdate = doc(db, "userTest", id);
    await updateDoc(docToUpdate, updatedDocument);

    // Do something with the updated form values
    console.log(updatedDocument);

    router.push("/users");
  };

  const addUserTimestamp = () => {
    setUser([...user, ""]);
  };

  return (
    <>
      {/* <p>Course Code: {router.query.id}</p> */}
      <h1 className="lg-title mb-5">Edit User</h1>
      <form id="editCourseForm" onSubmit={handleSubmit}>
        <div>
          <p>For user: <strong>{data.email}</strong></p>
          <label
            className="block text-white-700 text-lg font-bold mb-2"
            htmlFor="userName"
          >
            User Email
          </label>{" "}
          <input
            className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            id="userName"
            name="userName"
            required
            defaultValue={data.email}
          />
        </div>
       
        <div>
        

 
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
  const { id } = context.params;
  try {
    const usersCollection = collection(db, 'users');
    const documentRef = doc(usersCollection, id);
        const document = await getDoc(documentRef);

    let data = null;
    if (!document.empty) {
      const doc = document;
      data = doc.data();
    }

    return { props: { data } };
  } catch (error) {
    console.error('Error retrieving document ID:', error);
    throw error;
  }
};
