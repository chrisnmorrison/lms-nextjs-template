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
  newEmailAddress = null,
  newActiveStudent = null,
  newDepartment = null,
  newAdmin = null,
  newProgram = null,
  newStudentNumber = null,
  newEnrollmentDate = null,
  newRegisteredCourses = null
) {
  try {
    const userRef = doc(db, "users", documentId);
    const docSnapshot = await getDoc(userRef);

    if (docSnapshot.exists()) {
      const existingData = docSnapshot.data();
      const dataToUpdate = {
        title: newTitle || existingData.title,
        firstName: newFirstName || existingData.firstName,
        lastName: newLastName || existingData.lastName,
        email: newEmailAddress || existingData.email,
        activeStudent: newActiveStudent || existingData.activeStudent,
        department: newDepartment || existingData.department,
        admin: newAdmin || existingData.admin,
        program: newProgram || existingData.program,
        studentNumber: newStudentNumber || existingData.studentNumber,
        enrollmentDate: newEnrollmentDate || existingData.enrollmentDate,
        registeredCourses:
          newRegisteredCourses || existingData.registeredCourses,
      };

      await updateDoc(userRef, dataToUpdate);
      console.log("User data updated successfully");
    } else {
      console.error("User document does not exist");
    }
  } catch (error) {
    console.error("Error updating user data:", error);
  }
}

export default function Page() {
  // const options = [
  //   { value: "ITA1113", label: "ITA 1113" },
  //   { value: "ITA1114", label: "ITA 1114" },
  //   { value: "ITA1911", label: "ITA 1911" },
  // ];

  const options = ["ITA 1113", "ITA 1114", "ITA 1911"];

  const [user, setUser] = useState([]);
  const [data, setData] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [userTitle, setUserTitle] = useState("");
  const [activeStudent, setActiveStudent] = useState(null);
  const [department, setDepartment] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [program, setProgram] = useState(null);
  const [studentNumber, setStudentNumber] = useState(null);
  const [enrollmentDate, setEnrollmentDate] = useState(null);
  const [registeredCourses, setRegisteredCourses] = useState([]);
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
      activeStudent: event.target.activeStudent.value,
      department: event.target.department.value,
      isAdmin: event.target.admin.value,
      program: event.target.program.value,
      studentNumber: event.target.studentNumber.value,
    };
    setEnrollmentDate(new Date(event.target.value));

    var updatedList = [...registeredCourses];
    // Case 1 : The user checks the box
    if (event.target.registeredCourses) {
      updatedList = [...registeredCourses, event.target.value];
    } else {
      updatedList.splice(registeredCourses.indexOf(event.target.value), 1);
    }
    setRegisteredCourses(updatedList);

    await updateUserData(
      id,
      userTitle,
      firstName,
      lastName,
      email,
      activeStudent,
      department,
      admin,
      program,
      studentNumber,
      enrollmentDate,
      registeredCourses
    ); // Updates both name and email address
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
        <label
          className="block text-white-700 text-lg font-bold mb-2"
          htmlFor="department"
        >
          Department
        </label>
        <input
          type="text"
          id="department"
          name="department"
          placeholder="Department Name"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          //required
        />
        <label
          className="block text-white-700 text-lg font-bold mb-2"
          htmlFor="program"
        >
          Program
        </label>
        <input
          type="text"
          id="program"
          name="program"
          placeholder="Program Name"
          value={program}
          onChange={(e) => setProgram(e.target.value)}
          //required
        />
        <label
          className="block text-white-700 text-lg font-bold mb-2"
          htmlFor="studentNumber"
        >
          Student Number
        </label>
        <input
          type="number"
          id="studentNumber"
          name="studentNumber"
          placeholder="Student Number"
          value={studentNumber}
          onChange={(e) => setStudentNumber(e.target.value)}
          //required
        />
        <div className="date-picker-container">
          <label
            className="block text-white-700 text-lg font-bold mb-2"
            htmlFor="enrollmentDate"
          >
            Pick the Enrollment Date:
          </label>
          <input
            type="date"
            value={enrollmentDate}
            onChange={(e) => setEnrollmentDate(e.target.value)}
          />
        </div>
        <div>
          <h3>Courses Registration</h3>
          <input
            type="checkbox"
            name="registeredCourses"
            value="ITA1113"
            onChange={(e) => setRegisteredCourses(e.target.value)}
          />
          <label
            className="block text-white-700 text-lg font-bold mb-2"
            htmlFor="ITA1113"
          >
            ITA 1113
          </label>
          <input
            type="checkbox"
            name="registeredCourses"
            value="ITA1114"
            onChange={(e) => setRegisteredCourses(e.target.value)}
          />
          <label
            className="block text-white-700 text-lg font-bold mb-2"
            htmlFor="ITA1114"
          >
            ITA 1114
          </label>
          <input
            type="checkbox"
            name="registeredCourses"
            value="ITA1911"
            onChange={(e) => setRegisteredCourses(e.target.value)}
          />
          <label
            className="block text-white-700 text-lg font-bold mb-2"
            htmlFor="ITA1911"
          >
            ITA 1911
          </label>
        </div>
        <div className="mt-5">
          <p className="block text-white-700 text-lg font-bold mb-2">
            Active Student?
          </p>
          <div className="radio-Btn-Container">
            <div>
              <input
                type="radio"
                name="activeStudent"
                value="true"
                id="true"
                checked={activeStudent === "true"}
                onChange={(e) => setActiveStudent(e.target.value)}
              />
              <label htmlFor="activeStudent">Yes</label>
            </div>
            <div>
              <input
                type="radio"
                name="activeStudent"
                value="false"
                id="false"
                checked={activeStudent === "false"}
                onChange={(e) => setActiveStudent(e.target.value)}
              />
              <label htmlFor="activeStudent">No</label>
            </div>
          </div>
        </div>
        <div className="mt-5">
          <p className="block text-white-700 text-lg font-bold mb-2">
            Administration
          </p>
          <div className="radio-Btn-Container">
            <div>
              <input
                type="radio"
                name="admin"
                value="true"
                id="true"
                checked={admin === "true"}
                onChange={(e) => setAdmin(e.target.value)}
              />
              <label htmlFor="admin">Yes</label>
            </div>
            <div>
              <input
                type="radio"
                name="admin"
                value="false"
                id="false"
                checked={admin === "false"}
                onChange={(e) => setAdmin(e.target.value)}
              />
              <label htmlFor="admin">No</label>
            </div>
          </div>
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
