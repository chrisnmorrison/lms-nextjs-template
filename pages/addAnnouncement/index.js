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
import { db, storage } from "../../firebase";
import useFetchCourses from "../../hooks/fetchCourses";
import { useRouter } from "next/router";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Button } from "@mui/material";
import { v4 } from "uuid";

export default function AnnouncementsPage() {
  const router = useRouter();
  const { userInfo, currentUser } = useAuth();
  const [bannerUpload, setBannerUpload] = useState(null);
  const [activeCourses, setActiveCourses] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const [announcement, setAnnouncement] = useState({
    title: "",
    releaseDate: "",
    expiryDate: "",
    text: "",
    courseCode: "",
    activeCourses: [], // Add activeCourses field to the announcement state
  });

  async function handleAddAnnouncement(e) {
    e.preventDefault(); // Prevent the default form submission behavior
  
    try {
      const updatedFormData = {
        ...announcement,
      };
  
      // Add the new announcement to the "announcements" collection in Firestore
      await addDoc(collection(db, "announcements"), updatedFormData);
  
      setAnnouncement({
        title: "",
        releaseDate: "",
        expiryDate: "",
        text: "",
        courseCode: "",
        activeCourses: [],
      });
  
      router.push("/announcements"); // Redirect after successful submission
    } catch (error) {
      console.error("Error adding announcement:", error);
      // Handle error and display an error message to the user
    }
  }

  const handleActiveCourseChange = (event) => {
    const courseId = event.target.value;
    const isChecked = event.target.checked;

    setAnnouncement((prevAnnouncement) => {
      const { activeCourses } = prevAnnouncement;
      if (isChecked) {
        return {
          ...prevAnnouncement,
          activeCourses: [...activeCourses, courseId], // Add the new courseId to the array
        };
      } else {
        return {
          ...prevAnnouncement,
          activeCourses: activeCourses.filter((course) => course !== courseId), // Remove the courseId from the array
        };
      }
    });
  };

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
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

        setLoading(false);
      } catch (error) {
        console.error("Error retrieving document ID:", error);
        throw error;
      }
    };

    fetchData();
  }, []);

  return (
    <div className="w-full  text-xs sm:text-sm mx-auto flex flex-col flex-1 gap-3 sm:gap-5">
      <div className="flex items-center">
        <div className="w-full">
          <h2 className="mb-8 text-3xl text-center">Add New Announcement</h2>
          <form className="form-lg" onSubmit={handleAddAnnouncement}>
            <label className="">Announcement Title</label>
            <input
              value={announcement.title}
              onChange={(e) =>
                setAnnouncement({ ...announcement, title: e.target.value })
              }
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              placeholder="Announcement Title"
              required
            />

            <label className="">Announcement Release Date</label>
            <input
              value={announcement.releaseDate}
              onChange={(e) =>
                setAnnouncement({ ...announcement, releaseDate: e.target.value })
              }
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="datetime-local"
              required
            />

            <label className="">Announcement Expiry Date</label>
            <input
              value={announcement.expiryDate}
              onChange={(e) =>
                setAnnouncement({ ...announcement, expiryDate: e.target.value })
              }
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="datetime-local"
              required
            />

            <label className="">Announcement Text</label>
            <textarea
              required
              rows="5"
              value={announcement.text}
              onChange={(e) =>
                setAnnouncement({ ...announcement, text: e.target.value })
              }
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Announcement Text"
            />
              <div className="flex flex-col text-left">
              <label>Students registered in which courses should see this announcement?</label>
              {activeCourses.map((course, i) => (
                <div className="flex items-center" key={i}>
                  <input
                    type="checkbox"
                    name="registeredCourses"
                    value={course.id}
                    checked={announcement.activeCourses.includes(course.id)}
                    onChange={handleActiveCourseChange}
                  />
                  <label className="ml-2">
                    {course.courseCode}
                    {course.section} - {course.name}
                  </label>
                </div>
              ))}
            </div>
            {/* ... (rest of the form and button remain the same) */}
            <div className="mt-5">
          <Button variant="contained" type="submit">
            Submit
          </Button>
        </div>
          </form>
          
        </div>
        
      </div>
     
    </div>
    
  );
}