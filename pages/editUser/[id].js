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
  where,
} from "firebase/firestore";
import { db } from "../../firebase";
import useFetchCourses from "../../hooks/fetchCourses";
import { Button } from "@mui/material";

// Before it was 'export default function Page({ data })' but then when getServerSideProps got converted into useEffect, the argument for the function started throwing an error,
//Parsing error: Identifier 'data' has already been declared.
//Since we are using a state of data in conjunction with useEffect, it made sense to get rid of data being rendered as an argument for the function
export default function Page() {
  const [user, setUser] = useState([]);
  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(false);
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

  // Here getServerSideProps converted into useEffect
  //Also moved it to inside the function
  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const usersCollection = collection(db, "users");
        const documentRef = doc(usersCollection, id);
        const document = await getDoc(documentRef);

        let newData = null;
        if (!document.empty) {
          const docData = document.data();
          newData = docData;
        }

        setData(newData);
      } catch (error) {
        console.error("Error retrieving document ID:", error);
        throw error;
      }
    };

    fetchData();
  }, [id]);
  if (isLoading) return <p>Loading...</p>;
  if (!data) return <p>No profile data</p>;

  return (
    <>
      {/* <p>Course Code: {router.query.id}</p> */}
      <h1 className="lg-title mb-5">Edit User</h1>
      <form id="editCourseForm" onSubmit={handleSubmit}>
        <div>
          <p>
            For user: <strong>{data.email}</strong>
          </p>
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

        <div></div>
        <div className="mt-5">
          <Button variant="contained" type="submit">
            Submit
          </Button>
        </div>
      </form>
    </>
  );
}
