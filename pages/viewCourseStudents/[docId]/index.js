import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import {
    doc,
    collection,
    getDocs,
    getDoc
} from "firebase/firestore";
import { db } from "../../../firebase";

export default function Page() {
    const [courseId, setCourseId] = useState(null);
    const [registeredStudents, setRegisteredStudents] = useState([]);
    const [courseName, setCourseName] = useState("");

    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            const { docId } = router.query;
            const coursesCollection = collection(db, "courses");
            const courseDoc = await getDoc(doc(coursesCollection, docId));
            setCourseId(courseDoc.name);

            try {
                // Get reference to the course's students subcollection
                const studentsCollection = collection(db, `courses/${docId}/students`);
                const studentsSnapshot = await getDocs(studentsCollection);

                // Get the course document
                const courseDocRef = doc(db, "courses", docId);
                const courseDocSnapshot = await getDoc(courseDocRef);

                if (courseDocSnapshot.exists()) {
                    const courseData = courseDocSnapshot.data().name;
                    // Set the course state
                    setCourseName(courseData);
                } else {
                    console.log("Course not found");
                }

                if (!studentsSnapshot.empty) {
                    // Map over each student document
                    let students = studentsSnapshot.docs.map(async (studentDoc) => {
                        // Get reference to the student's user document
                        console.log(studentDoc.data());
                        const userDocRef = studentDoc.data().StudentID;
                        const userDocSnapshot = await getDoc(userDocRef);

                        if (userDocSnapshot.exists()) {
                            if (!(studentDoc.data().Status === "REGISTERED")) {
                                return null;
                            }
                            return {
                                id: studentDoc.id,
                                grade: studentDoc.data().Grade,
                                status: studentDoc.data().Status,
                                studentInfo: userDocSnapshot.data()
                            };
                        } else {
                            console.log("User document not found");
                            return null;
                        }
                    });

                    students = await Promise.all(students);
                    setRegisteredStudents(students);
                } else {
                    console.log("No students found");
                    // Handle the case when no students are found
                }
            } catch (error) {
                console.error("Error retrieving students:", error);
                throw error;
            }
        };

        fetchData();
    }, [router.query]);

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
                </tr>
                </thead>
                <tbody>
                {registeredStudents.map((student, index) =>
                    <tr key={index}>
                        <td>{student.studentInfo.firstName} {student.studentInfo.lastName}</td>
                        <td>{student.grade}</td>
                        <td>{student.status}</td>
                    </tr>
                )}
                </tbody>
            </table>
        </>
    );
}
