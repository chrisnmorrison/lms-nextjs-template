import React, { useState, useEffect, useRef } from 'react'
import { doc, getDoc, getDocs, collection, getFirestore } from 'firebase/firestore'
import { useAuth } from '../context/AuthContext'
import { db } from '../firebase'

export default function useFetchUsers() {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [users, setUsers] = useState([])

    const { currentUser } = useAuth()

    useEffect(() => {
        const fetchData = async () => {
          const usersCollection = collection(db, 'users');
          const usersSnapshot = await getDocs(usersCollection);
          const usersData = usersSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setUsers(usersData);
          setLoading(false);
        };
      
        fetchData();
    }, [])

    return { loading, error, users, setUsers }
}
