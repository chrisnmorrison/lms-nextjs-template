import Head from "next/head";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Login from "../components/Login";
import UserDashboard from "../components/UserDashboard";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/router";
import {
  doc,
  setDoc,
  deleteField,
  getFirestore,
  collection,
  addDoc,
  collection,
  getDocs,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { storage, db } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";

export default function Home() {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [videoUpload, setVideoUpload] = useState(null);

  const router = useRouter();

  const handleSubmit = async (event) => {
    setLoading(true);
    event.preventDefault();

    if (videoUpload === null) {
      return;
    }

    const storageRef = ref(storage, `videos/${imageUpload.name + v4()}`);
    await uploadBytes(imageRef, imageUpload);

    const videoUrl = await getDownloadURL(storageRef);

    const updatedDocument = {
      title: event.target.videoTitle.value,
      videoUrl: videoUrl
    };

    const firestore = getFirestore();
    const collectionRef = collection(firestore, "videoTest");
    try{
       const newDoc = await addDoc(collectionRef, updatedDocument);
    } catch (e) {
      alert("Error uploading video.");
    }
   

    setLoading(false);
    router.push("/courses");
  };

  useEffect(() => {}, []);

  return (
    <>
      <Head>
        <title>Test Page</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {!currentUser && <Login />}
      {currentUser && (
        <div className="w-full max-w-md mx-auto">
          <form
            className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
            onSubmit={handleSubmit}
          >
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="title"
              >
                Video Title
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="videoTitle"
                name="videoTitle"
                type="text"
                placeholder="Title"
              />
            </div>
            <div className="mb-6">
              <input
                type="file"
                name="file"
                id="file"
                className="sr-only"
                onChange={(e) => {
                  setVideoUpload(e.target.files[0]);
                }}
              />
              <label
                htmlFor="file"
                id="videoFile"
                name="videoFile"
                className="relative flex min-h-[200px] items-center justify-center rounded-md border border-dashed border-[#e0e0e0] p-12 text-center"
              >
                <div>
                  <span className="mb-2 block text-xl font-semibold text-[#07074D]">
                    Drop files here
                  </span>
                  <span className="mb-2 block text-base font-medium text-[#6B7280]">
                    Or
                  </span>
                  <span className="inline-flex rounded border border-[#e0e0e0] py-2 px-7 text-base font-medium text-[#07074D]">
                    Browse
                  </span>
                </div>
              </label>
            </div>
            <div className="flex items-center justify-center">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
              >
                Upload
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
