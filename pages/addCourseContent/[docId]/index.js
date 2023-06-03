import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import {
  doc,
query,
  collection,
  getDocs,
  getDoc,
  updateDoc,
  addDoc,
  where,
} from "firebase/firestore";
import { db } from "../../../firebase";
import TextForm from "../../../components/addCourseContent/AddCourseTextContent";
import QuizForm from "../../../components/addCourseContent/AddCourseQuizContent";
import VideoForm from "../../../components/addCourseContent/AddCourseVideoContent";


export default function Page() {
  const [documentId, setDocumentId] = useState(null);
  const [data, setData] = useState(null);
  const [course, setCourse] = useState("");
  const [courseContent, setCourseContent] = useState([]);
  const [selectedDropdown, setSelectedDropdown] = useState("");
 
  const router = useRouter();
 const docId = router.query.docId;
  const handleDropdown = (event) => {
    setSelectedDropdown(event.target.value);
  };

  const handleSubmit = async (formData) => {
    try {
      // Add your logic here to handle form submission
      // For example, you can add the form data to the Firebase Firestore
      const { type } = formData;
      await addDoc(collection(db, "courseContent"), formData);
      setCourse("");
  
      console.log("Form submitted successfully");
      router.push(`/courseContent/${docId}`);
    } catch (error) {
      console.error("Error submitting form:", error);
      // Handle the error accordingly
    }

  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, "courses", docId);
        console.log(docId);
  
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setData(docSnap.data());
          console.log("Document data:", docSnap.data());
        }
      } catch (error) {
        console.error("Error retrieving course content:", error);
        throw error;
      }
    };
  
    fetchData();
  }, [docId]); // Include docId in the dependency array
  

  let formComponent = null;

  switch (selectedDropdown) {
    case 'text':
      formComponent = <TextForm onSubmit={handleSubmit} documentId={docId}  type="Text" />;
      break;
    case 'video':
      formComponent = <VideoForm onSubmit={handleSubmit} documentId={docId}  type="Video" />;
      break;
    case 'quiz':
      formComponent = <QuizForm onSubmit={handleSubmit} documentId={docId} type="Quiz" />;
      break;
    default:
      formComponent = null;
  }


  return (
    <>
      {/* <p>Course Code: {router.query.id}</p> */}
      <h1>Adding New Content for Course: {data ? <strong>{data.name} ({data.courseCode}{data.section})</strong> : <span>Loading...</span>}</h1>      <div className="">
        <label className="text-white" htmlFor="options">Select an option:</label>
      <select id="options" defaultValue={selectedDropdown} onChange={handleDropdown} className="px-1 py-2 ml-2">
        <option value="" disabled >-- Select an Option --</option>
        <option value="text">Text</option>
        <option value="video">Video</option>
        <option value="quiz">Quiz</option>
      </select>
       
   
        {formComponent}
      
      </div>
    </>
  );
}
