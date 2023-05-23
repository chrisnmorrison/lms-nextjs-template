import React, { useState, useEffect, useRef } from "react";
import {
  doc,
  getDoc,
  getDocs,
  collection,
  getFirestore,
} from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";

export default function useFetchVideos() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [videos, setVideos] = useState([]);

  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      const videosCollection = collection(db, "videoTest");
      const videosSnapshot = await getDocs(videosCollection);
      const videosData = videosSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setVideos(videosData);
      setLoading(false);
    };

    fetchData();
  }, []);

  return { loading, error, videos, setVideos };
}
