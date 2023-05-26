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
  where
} from "firebase/firestore";
import { db } from "../../firebase";
import useFetchCourses from "../../hooks/fetchCourses";
import { Button } from "@mui/material";

//Please check comments for editUser
export default function Page() {
  const [video, setVideo] = useState([]);
  const { title, videoUrl } = document;
  const [data, setData] = useState(null);

  const router = useRouter();
  const { id } = router.query;

  const handleSubmit = async (event) => {
    event.preventDefault();

  const updatedVideoTimestamps = [];
  for (let i = 0; i < video.length; i++) {
    const timestamp = event.target[`videoTimestamp${i}`].value;
    updatedVideoTimestamps.push(timestamp);
  }

  const updatedDocument = {
    name: event.target.videoName.value,
    code: event.target.videoCode.value,
    description: event.target.videoDescription.value,
    videoTimestamps: updatedVideoTimestamps,
  };

    const docToUpdate = doc(db, "videoTest", id);
    await updateDoc(docToUpdate, updatedDocument);

    // Do something with the updated form values
    console.log(updatedDocument);

    router.push("/videos");
  };

  const addVideoTimestamp = () => {
    setVideo([...video, ""]);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const videosCollection = collection(db, 'videoTest');
        const documentRef = doc(videosCollection, id);
        const document = await getDoc(documentRef);

        let newData = null;
        if (!document.empty) {
          const docData = document.data();
          newData = docData;
        }

        setData(newData);
      } catch (error) {
        console.error('Error retrieving document ID:', error);
        throw error;
      }
    };

    fetchData();
  }, [id]);

  return (
    <>
      {/* <p>Course Code: {router.query.id}</p> */}
      <h1 className="lg-title mb-5">Edit Video</h1>
      <form id="editCourseForm" onSubmit={handleSubmit}>
        <div>
          <p>For video: <strong>{data.videoUrl}</strong></p>
          <label
            className="block text-white-700 text-lg font-bold mb-2"
            htmlFor="videoName"
          >
            Video Title
          </label>{" "}
          <input
            className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            id="videoName"
            name="videoName"
            required
            defaultValue={data.title}
          />
        </div>
       
        <div>
        <label
    className="block text-white-700 text-lg font-bold mb-2"
    htmlFor="videoCode"
  >
    Video Timestamps:
  </label>
  {video.map((timestamp, index) => (
    <input
      key={index}
      className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      type="text"
      name={`videoTimestamp${index}`}
      value={timestamp}
      onChange={(e) => {
        const updatedVideo = [...video];
        updatedVideo[index] = e.target.value;
        setVideo(updatedVideo);
      }}
      required
    />
  ))}
  <Button type="button" variant="outlined" onClick={addVideoTimestamp}>
    Add Timestamp
  </Button>
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


