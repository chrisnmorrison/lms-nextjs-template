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
  getFirestore,
} from "firebase/firestore";
import { db } from "../../firebase";
import { Button } from "@mui/material";

export default function Page() {
  const options = ["ITA 1113", "ITA 1114", "ITA 1911"];

  const [formData, setFormData] = useState({});
  const [registeredCourses, setRegisteredCourses] = useState([]);
  const [activeCourses, setActiveCourses] = useState([]);
  const [isFirstEffectDone, setIsFirstEffectDone] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();
  const { id } = router.query;

  // Handles the submit event on form submit.
  const handleSubmit = async (event) => {
    event.preventDefault();

    const updatedFormData = {
      ...formData,
      registeredCourses: registeredCourses || [],
    };

    const docToUpdate = doc(db, "users", id);
    await updateDoc(docToUpdate, updatedFormData);

    //console.log(updatedFormData);
    setSuccessMessage("Data saved successfully!");

    setTimeout(() => {
      router.push("/users");
    }, 5000);
  };

  //write to console whenever formData changes
  useEffect(() => {
    console.log(formData);
    console.log(registeredCourses);
  }, [formData, registeredCourses]);

  //only run once when the page loads
  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const usersCollection = collection(db, "users");
        const documentRef = doc(usersCollection, id);
        const document = await getDoc(documentRef);

        const coursesCollection = collection(db, "courses");
        const activeCoursesQuery = query(
          coursesCollection,
          where("activeCourse", "==", true)
        );
        const coursesSnapshot = await getDocs(activeCoursesQuery);
        const courseData = [];
        coursesSnapshot.forEach((doc) => {
          courseData.push({ id: doc.id, ...doc.data() });
        });

        setActiveCourses(courseData);

        console.log(activeCourses);
        console.log(registeredCourses);

        let newData = null;
        if (!document.empty) {
          const docData = document.data();
          newData = docData;
        }
        setFormData(newData);

        // setFormData((prevFormData) => ({
        //   ...prevFormData,

        // }));
        console.log(formData.registeredCourses);

        setLoading(false);
      } catch (error) {
        console.error("Error retrieving document ID:", error);
        throw error;
      }
    };

    fetchData();
    setRegisteredCourses(formData.registeredCourses);
    setIsFirstEffectDone(true);
  }, [id]);

  useEffect(() => {
    // Second useEffect code that depends on the first useEffect

    if (isFirstEffectDone) {
      setRegisteredCourses(formData.registeredCourses);
    }
  }, [isFirstEffectDone, formData.registeredCourses]);

  if (isLoading) return <p>Loading...</p>;
  if (!formData) return <p>No profile data</p>;

  const handleRegisteredCourseChange = (event) => {
    const courseId = event.target.value;
    const isChecked = event.target.checked;

    setRegisteredCourses((prevCourses) => {
      if (isChecked) {
        return prevCourses ? [...prevCourses, courseId] : [courseId];
      } else {
        return prevCourses
          ? prevCourses.filter((course) => course !== courseId)
          : [];
      }
    });
  };

  return (
    <>
      <h1 className="lg-title mb-5">Edit User</h1>
      <h2 className="md-title">
        User:
        <strong>
          {formData.firstName}&nbsp;{formData.lastName}&nbsp;{formData.email}
        </strong>
      </h2>
      <form className="form-lg" id="editCourseForm" onSubmit={handleSubmit}>
        <label className="" htmlFor="title">
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          //required
        />
        <label className="" htmlFor="first">
          First Name
        </label>
        <input
          type="text"
          id="first"
          name="first"
          placeholder="First Name"
          value={formData.firstName}
          onChange={(e) =>
            setFormData({ ...formData, firstName: e.target.value })
          }
          //required
        />
        <label className="" htmlFor="last">
          Last Name
        </label>
        <input
          type="text"
          id="last"
          name="last"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={(e) =>
            setFormData({ ...formData, lastName: e.target.value })
          }
          //required
        />
        <label className="" htmlFor="email">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="example@example.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          //required
        />
        <label className="" htmlFor="department">
          Department
        </label>
        <input
          type="text"
          id="department"
          name="department"
          placeholder="Department Name"
          value={formData.department}
          onChange={(e) =>
            setFormData({ ...formData, department: e.target.value })
          }
          //required
        />
        <label className="" htmlFor="program">
          Program
        </label>
        <input
          type="text"
          id="program"
          name="program"
          placeholder="Program Name"
          value={formData.program}
          onChange={(e) =>
            setFormData({ ...formData, program: e.target.value })
          }
          //required
        />
        <label className="" htmlFor="studentNumber">
          Student Number
        </label>
        <input
          type="number"
          id="studentNumber"
          name="studentNumber"
          placeholder="Student Number"
          value={formData.studentNumber}
          onChange={(e) =>
            setFormData({ ...formData, studentNumber: e.target.value })
          }
          //required
        />
        <div className="date-picker-container">
          <label className="mr-2" htmlFor="enrollmentDate">
            Student&apos;s Enrolment Date:
          </label>
          <input
            type="date"
            value={formData.enrollmentDate}
            onChange={(e) =>
              setFormData({ ...formData, enrollmentDate: e.target.value })
            }
          />
        </div>
        <div className="flex flex-col text-left">
          <label>Courses Registration</label>
          {activeCourses.map((course, i) => (
            <div className="flex items-center" key={i}>
              <input
                type="checkbox"
                name="registeredCourses"
                value={course.id}
                checked={
                  registeredCourses
                    ? registeredCourses.includes(course.id)
                    : null
                }
                onChange={handleRegisteredCourseChange}
              />
              <label className="ml-2">
                {course.courseCode}
                {course.section} - {course.name}
              </label>
            </div>
          ))}
        </div>

        <div className="mt-5">
          <label className="">Active Student?</label>
          <div className="radio-Btn-Container">
            <div>
              <input
                type="checkbox"
                name="activeStudent"
                value="true"
                id="true"
                checked={formData.activeStudent}
                onChange={(e) =>
                  setFormData({ ...formData, activeStudent: e.target.checked })
                }
              />
              <label htmlFor="activeStudent">Yes</label>
            </div>
          </div>
        </div>
        <div className="mt-5">
          <label className="">Is this user an administrator?</label>
          <div className="radio-Btn-Container">
            <div>
              <input
                type="checkbox"
                name="admin"
                value="true"
                id="true"
                checked={formData.isAdmin}
                onChange={(e) =>
                  setFormData({ ...formData, isAdmin: e.target.checked })
                }
              />
              <label htmlFor="admin">Yes</label>
            </div>
          </div>
        </div>
        <div className="mt-5">
          <Button variant="contained" type="submit">
            Submit
          </Button>
        </div>
        {/* Display the success message */}
        {successMessage && <p className="success-message">{successMessage}</p>}
      </form>
    </>
  );
}
