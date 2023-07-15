import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { doc, collection, getDocs, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import { Link } from "@mui/material";
import { Button } from "@mui/material";

export default function Page() {
  const [courseId, setCourseId] = useState(null);
  const [registeredStudents, setRegisteredStudents] = useState([]);
  const [courseName, setCourseName] = useState("");

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      if (router.query.id) {
        try {
          const courseId = router.query.id;
          setCourseId(courseId);

          // Get the course name from Firestore
          const courseDocRef = doc(db, "courses", courseId);
          const courseDocSnap = await getDoc(courseDocRef);
          if (courseDocSnap.exists()) {
            const courseData = courseDocSnap.data();
            setCourseName(courseData.name);
          }

          // Query users collection for registered students
          const usersCollectionRef = collection(db, "users");
          const usersQuerySnapshot = await getDocs(usersCollectionRef);

          const registeredStudents = [];
          usersQuerySnapshot.forEach((userDoc) => {
            const userData = userDoc.data();
            const registeredCourses = userData.registeredCourses || [];

            if (registeredCourses.includes(courseId)) {
              registeredStudents.push({
                userDocId: userDoc.id,
                ...userData,
              });
            }
          });

          setRegisteredStudents(registeredStudents);

          console.log(registeredStudents);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
  }, [router.query]);

  function handleDelete(userKey) {
    return async () => {
      const tempObj = { ...users };
      delete tempObj[userKey];

      setUsers(tempObj);
      const userRef = doc(db, "users", currentUser.uid);
      await setDoc(
        userRef,
        {
          users: {
            [userKey]: deleteField(),
          },
        },
        { merge: true }
      );
    };
  }
  return (
    <>
      <div className="flex items-center">
        <h1 className="text-3xl">View Course Students: {courseName}</h1>
      </div>
      <h2>Registered Students</h2>

      <table className="table-dark">
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Grade</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {registeredStudents.map((student, index) => (
            <tr key={index}>
              <td>
                {student.firstName} {student.lastName}
              </td>
              <td>{student.email}</td>
              <td>{student.studentNumber}</td>
              <td className="flex">
                <Link href={`/editUser/${student.userDocId}`}>
                  <Button
                    size="small"
                    sx={{ mr: 0.5, ml: 0.5 }}
                    variant="contained"
                  >
                    Edit User
                  </Button>
                </Link>
                <Button
                  size="small"
                  sx={{ ml: 0.5 }}
                  color="error"
                  variant="contained"
                  onClick={() => handleDelete(student.userDocId)}
                >
                  Delete User
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
