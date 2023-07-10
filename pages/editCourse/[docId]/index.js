import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import {
  doc,
  setDoc,
  deleteField,
  deleteDoc,
  addDoc,
  collection,
  getDocs,
  getDoc,
  updateDoc,
  query,where
} from "firebase/firestore";
import { db, storage } from "../../../firebase";
import useFetchCourses from "../../../hooks/fetchCourses";
import { Button } from "@mui/material";
import Link from "next/link";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";

export default function Page() {
  const [documentId, setDocumentId] = useState(null);
  const [data, setData] = useState(null);
  const [course, setCourse] = useState("");
  const [bannerUpload, setBannerUpload] = useState(null);


  const router = useRouter();
  const docId = router.query.docId;

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Handle the form submission logic here
    // You can access the form field values using event.target

    // Example code:

    let storageRef;
    let bannerUrl;

    if (bannerUpload) {
      storageRef = ref(storage, `images/${v4() + bannerUpload.name}`);
      await uploadBytes(storageRef, bannerUpload);
  
     bannerUrl = await getDownloadURL(storageRef);
    } else {
      // Set a default or fallback value for bannerUrl when no file is uploaded
      bannerUrl = ''; // You can set it to an empty string or any other appropriate value
    }
    console.log(bannerUrl)
    const updatedFormData = {
      ...course,
      bannerUrl: bannerUrl,
    };

    const docToUpdate = doc(db, "courses", docId);
    await updateDoc(docToUpdate, updatedFormData);

    // Do something with the updated form values
    console.log(updatedFormData);

    router.push("/courses");
  };

  useEffect(() => {
    const fetchData = async () => {
     
      try {
        const docRef = doc(db, "courses", docId);
        const docSnap = await getDoc(docRef);
        
  
        if (docSnap.exists()) {
          setCourse(docSnap.data());
          console.log("Document data:", docSnap.data());
        } else {
          // docSnap.data() will be undefined in this case
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error retrieving document ID:", error);
        throw error;
      }
    };
  
    fetchData();
  }, [docId]);
  

  return (
    <>
      {/* <p>Course Code: {router.query.id}</p> */}
      <h1 className="lg-title mb-5">Edit Course Information</h1>
      <div className="flex gap-x-36">
        {" "}
        <div className="w-full">
        <form className="form-lg" onSubmit={handleSubmit}>
           
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
             required
           />
        
           <label className="">
             Course Code
           </label>
           <input
             value={course.courseCode}
             onChange={(e) => setCourse({ ...course, courseCode: e.target.value.replace(/\s/g, '') })}
             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
             id="courseName"
             type="text"
             placeholder="e.g. ITAL1000"
             required
           />
            <label className="mt-10" htmlFor="file">Banner Picture Upload</label>
     <input
              
              type="file"
              name="file"
              id="file"
              className="sr-only"
              onChange={(e) => {
                setBannerUpload(e.target.files[0]);
              }}
            />
            <label
              htmlFor="file"
              id="videoFile"
              name="videoFile"
              className="relative flex min-h-[100px] items-center justify-center rounded-md border border-dashed border-[#e0e0e0] p-4 text-center"
            >
              <div>
              
                <span className="inline-flex rounded border border-[#e0e0e0] py-2 px-7 text-base font-medium text-[#07074D]">
                  Browse
                </span>
                {bannerUpload && 
                <p className="text-black">{bannerUpload.name}</p>}
              </div>
            </label>
            <label className="">
             Course Section
           </label>
           <input
             value={course.section}
             onChange={(e) => setCourse({ ...course, section: e.target.value.replace(/\s/g, '') })}
             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
             id="courseName"
             type="text"
             placeholder="e.g. A"
             required
           />
             <label className="">
             Year
           </label>
           <input
             value={course.year}
             onChange={(e) => setCourse({ ...course, year: e.target.value.replace(/\s/g, '') })}
             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
             id="courseName"
             type="text"
             placeholder="e.g. 2023"
             required
           />
        
           <label className="">
             Semester
           </label>
           <select
             required
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
 Is this class actively running? (inactive classes will not be shown to students)
</label>
<input
 checked={course.activeCourse}
 onChange={(e) => setCourse({ ...course, activeCourse: e.target.checked })}
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
 placeholder="e.g. River Building, 2200 (optional, leave blank if class is virtual)"  />

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
             className="btn"
             type="submit"
           >
             Submit
           </button>
         
       </form>
        </div>
       
        {/* <div className="flex-1">
          <p className='pb-5'>Use this link to edit course content (learning material, videos, etc.)</p>
          <Link href={`/courseContent/${course}`}>
           
            <Button  variant="contained" color='success'>
              Edit Course Content
            </Button>
          </Link>
        </div> */}
      </div>
    </>
  );
}
