import React from 'react'
import useSWR from 'swr'
import { doc, getDoc, getDocs, collection, getFirestore } from 'firebase/firestore'
import { useAuth } from '../context/AuthContext'
import { db } from '../firebase'

const fetchVideos = async (url) => {
  const videosCollection = collection(db, 'videoTest');
  const videosSnapshot = await getDocs(videosCollection);
  const videosData = videosSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return videosData;
}

export default function useFetchVideos() {
  const { currentUser } = useAuth()
  const { data, error } = useSWR('/api/videos', fetchVideos)

  return {
    videos: data,
    loading: !error && !data,
    error: error,
    setVideos: () => {
      throw new Error('setVideos is not supported with SWR. To mutate data, consider using mutate from SWR')
    }
  }
}
