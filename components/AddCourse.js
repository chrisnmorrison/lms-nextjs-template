import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import CourseCard from "./CourseCard";
import {
  doc,
  setDoc,
  deleteField,
  addDoc,
  collection,
} from "firebase/firestore";
import { db } from "../firebase";
import useFetchCourses from "../hooks/fetchCourses";
import { useRouter } from "next/router";

export default function UserDashboard() {
  const router = useRouter();
  const { userInfo, currentUser } = useAuth();
  const [course, setCourse] = useState([]);


  //console.log(courses)

  // useEffect(() => {
  //     if (!userInfo || Object.keys(userInfo).length === 0) {
  //         setAddCourse(true)
  //     }
  // }, [userInfo])

  async function handleAddCourse() {
    if (!course) {
      return;
    }
    const docRef = await addDoc(collection(db, "courses"), course);
    setCourse("");
    router.push("/courses");
  }

  


  

  return (
    <div className="w-full  text-xs sm:text-sm mx-auto flex flex-col flex-1 gap-3 sm:gap-5">
      <div className="flex items-center">
        <div className="w-full">
          <form className="form-lg">
           
              <label className="">
                Course Name
              </label>
              <input
                value={course.name}
                onChange={(e) => setCourse({ ...course, name: e.target.value })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="courseName"
                type="text"
                placeholder="Course Name"
              />
           
              <label className="">
                Semester
              </label>
              <input
                value={course.name}
                onChange={(e) => setCourse({ ...course, name: e.target.value })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="courseName"
                type="text"
                placeholder="Course Name"
              />
           
              <label className="">
                Semester
              </label>
              <select
    value={course.semester}
    onChange={(e) => setCourse({ ...course, semester: e.target.value })}
    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    id="courseName"
  >
      <option value=""></option>
    <option value="winter">Winter</option>
    <option value="spring">Spring</option>
    <option value="summer">Summer</option>
    <option value="fall">Fall</option>
  </select>
           
  <label className="">
    Is this class virtual?
  </label>
  <input
    checked={course.isVirtual}
    onChange={(e) => setCourse({ ...course, isVirtual: e.target.checked })}
    className="form-checkbox h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
    type="checkbox"
    id="virtualClass"
  />
        
  <label className="">
    Building & Location
  </label>
  <input
    value={course.location}
    onChange={(e) => setCourse({ ...course, location: e.target.value })}
    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    id="courseName"
    type="text"
    placeholder="Course Name"
  />

  <label className="">
    Day
  </label>
  <select
    value={course.dayOfWeek}
    onChange={(e) => setCourse({ ...course, dayOfWeek: e.target.value })}
    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    id="location"
  >
    <option value=""></option>
    <option value="Monday">Monday</option>
    <option value="Tuesday">Tuesday</option>
    <option value="Wednesday">Wednesday</option>
    <option value="Thursday">Thursday</option>
    <option value="Friday">Friday</option>
    <option value="Saturday">Saturday</option>
    <option value="Sunday">Sunday</option>
  </select>

  <label className="">
    Time
  </label>
  <input
    value={course.time}
    onChange={(e) => setCourse({ ...course, time: e.target.value })}
    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    id="courseName"
    type="time"
  />

              <label className="">
                Course Description
              </label>
              <textarea
                rows="5"
                value={course.description}
                onChange={(e) =>
                  setCourse({ ...course, description: e.target.value })
                }
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="courseName"
                type="text"
                placeholder="Course Description"
       />
              <button
                onClick={handleAddCourse}
                className=""
                type="button"
              >
                Submit
              </button>
            
          </form>
        </div>
        {/* <input type='text' placeholder="Enter course" value={course} onChange={(e) => setCourse(e.target.value)} className="outline-none p-3 text-base sm:text-lg text-slate-900 flex-1" />
                <button onClick={handleAddCourse} className='w-fit px-4 sm:px-6 py-2 sm:py-3 bg-amber-400 text-white font-medium text-base duration-300 hover:opacity-40'>ADD</button>
          */}{" "}
      </div>
    </div>
  );
}

export const GetServerSideProps = () => {};
