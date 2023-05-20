import React, { useState, useEffect, useRef } from 'react'
import { doc, getDoc, getDocs, collection, getFirestore } from 'firebase/firestore'
import { useAuth } from '../context/AuthContext'
import { db } from '../firebase'

export default function useFetchCourses() {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [courses, setCourses] = useState([])

    const { currentUser } = useAuth()

    useEffect(() => {
        const fetchData = async () => {
          const coursesCollection = collection(db, 'courses');
          const coursesSnapshot = await getDocs(coursesCollection);
          const coursesData = coursesSnapshot.docs.map(doc => doc.data());
          console.log(coursesData)
          setCourses(coursesData);
          setLoading(false);
        };
      
        fetchData();
    }, [])

    return { loading, error, courses, setCourses }
}
