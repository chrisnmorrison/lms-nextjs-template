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
import { Button } from "@mui/material";

async function updateUserData(
  documentId,
  newTitle = null,
  newFirstName = null,
  newLastName = null,
  newEmailAddress = null
) {
  try {
    const userRef = doc(db, "users", documentId);
    const dataToUpdate = {};

    if (newTitle !== null) {
      dataToUpdate.title = newTitle;
    }

    if (newEmailAddress !== null) {
      dataToUpdate.email = newEmailAddress;
    }
    if (newFirstName !== null) {
      dataToUpdate.firstName = newFirstName;
    }
    if (newLastName !== null) {
      dataToUpdate.lastName = newLastName;
    }

    await updateDoc(userRef, dataToUpdate);
    console.log("User data updated successfully");
  } catch (error) {
    console.error("Error updating user data:", error);
  }
}

export default function Page() {
  const [user, setUser] = useState([]);
  const [data, setData] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [userTitle, setUserTitle] = useState("");
  const [isLoading, setLoading] = useState(false);
  const { title, userUrl } = document;

  const router = useRouter();
  const { id } = router.query;
  // Handles the submit event on form submit.
  const handleSubmit = async (event) => {
    event.preventDefault(); // Stop the form from submitting and refreshing the page.

    // Get data from the form.
    const updatedDocument = {
      title: event.target.title.value,
      first: event.target.first.value,
      last: event.target.last.value,
      email: event.target.email.value,
    };

    await updateUserData(id, userTitle, firstName, lastName, email); // Updates both name and email address
    // const docToUpdate = doc(db, "userTest", id);
    //await updateDoc(docToUpdate, updatedDocument);

    // Do something with the updated form values
    console.log(updatedDocument);

    router.push("/users");
  };

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
        setLoading(false);
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
      <h1 className="lg-title mb-5">Edit User</h1>
      <h2 className="md-title">
        User:
        <strong>
          &nbsp;{data.firstName}&nbsp;{data.lastName}
        </strong>
      </h2>
      <form id="editCourseForm" onSubmit={handleSubmit}>
        <label
          className="block text-white-700 text-lg font-bold mb-2"
          htmlFor="title"
        >
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          placeholder="Title"
          value={userTitle}
          onChange={(e) => setUserTitle(e.target.value)}
          //required
        />
        <label
          className="block text-white-700 text-lg font-bold mb-2"
          htmlFor="first"
        >
          First Name
        </label>
        <input
          type="text"
          id="first"
          name="first"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          //required
        />
        <label
          className="block text-white-700 text-lg font-bold mb-2"
          htmlFor="last"
        >
          Last Name
        </label>
        <input
          type="text"
          id="last"
          name="last"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          //required
        />
        <label
          className="block text-white-700 text-lg font-bold mb-2"
          htmlFor="email"
        >
          Email Address
        </label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="example@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          //required
        />
        <div className="mt-5">
          <Button variant="contained" type="submit">
            Submit
          </Button>
        </div>
      </form>
    </>
  );
}
