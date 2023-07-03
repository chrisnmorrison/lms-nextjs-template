import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import VideoCard from "./VideoCard";
import {
  doc,
  setDoc,
  deleteField,
  addDoc,
  collection,
} from "firebase/firestore";
import { db } from "../firebase";
import useFetchVideos from "../hooks/fetchVideos";
import { Link } from "@mui/material";
import { Button } from "@mui/material";

export default function UserDashboard() {
  const { userInfo, currentUser } = useAuth();
  const [edit, setEdit] = useState(null);
  const [video, setVideo] = useState([]);
  const [edittedValue, setEdittedValue] = useState("");

  const { videos, setVideos, loading, error } = useFetchVideos();

  async function handleEditVideo(i) {
    if (!edittedValue) {
      return;
    }
    const newKey = edit;
    setVideos({ ...videos, [newKey]: edittedValue });
    const userRef = doc(db, "videos", currentUser.uid);
    await setDoc(
      userRef,
      {
        videos: {
          [newKey]: edittedValue,
        },
      },
      { merge: true }
    );
    setEdit(null);
    setEdittedValue("");
  }

  function handleAddEdit(videoKey) {
    return () => {
      console.log(videos[videoKey]);
      setEdit(videoKey);
      setEdittedValue(videos[videoKey]);
    };
  }

  function handleDelete(videoKey) {
    return async () => {
      const tempObj = { ...videos };
      delete tempObj[videoKey];

      setVideos(tempObj);
      const userRef = doc(db, "videos", currentUser.uid);
      await setDoc(
        userRef,
        {
          videos: {
            [videoKey]: deleteField(),
          },
        },
        { merge: true }
      );
    };
  }

  return (
    <div className="w-full  text-xs sm:text-sm mx-auto flex flex-col flex-1 gap-3 sm:gap-5">
      <div className="flex items-center">
        <h1 className="text-3xl">Video List</h1>
      </div>
      {loading && (
        <div className="flex-1 grid place-items-center">
          <i className="fa-solid fa-spinner animate-spin text-6xl"></i>
        </div>
      )}
      <div className="current-videos">
        {!loading && (
          <>
            {videos.map((video, i) => {
              return (
                <VideoCard
                  handleEditVideo={handleEditVideo(i)}
                  key={i}
                  handleAddEdit={handleAddEdit}
                  edit={edit}
                  videoKey={video}
                  edittedValue={edittedValue}
                  setEdittedValue={setEdittedValue}
                  handleDelete={handleDelete}
                >
                  <h2 style={{ fontSize: "200%", marginBottom: ".5rem" }}>
                    {video.title}
                  </h2>
                  {/* <p>{video.videoUrl}</p> */}
                  <p>{video.id}</p>
                </VideoCard>
              );
            })}
            {/* <div className="mt-5">
              <Link
                href="/AddVideo"
                underline="hover"
                style={{ fontSize: "200%", marginBottom: ".5rem" }}
              >
                <Button size="large" variant="outlined">
                  Add New Video
                </Button>
              </Link>
            </div> */}
          </>
        )}
      </div>
      {/* {!addVideo && <button onClick={() => setAddVideo(true)} className='text-cyan-300 border border-solid border-cyan-300 py-2 text-center uppercase text-lg duration-300 hover:opacity-30'>ADD COURSE</button>} */}
    </div>
  );
}

export const GetServerSideProps = () => {};
