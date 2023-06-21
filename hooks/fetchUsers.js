import React from 'react'
import useSWR from 'swr'
import { doc, getDoc, getDocs, collection, getFirestore } from 'firebase/firestore'
import { useAuth } from '../context/AuthContext'
import { db } from '../firebase'

const fetcher = async (url) => {
    const usersCollection = collection(db, 'users');
    const usersSnapshot = await getDocs(usersCollection);
    const usersData = usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
    return usersData;
}

export default function useFetchUsers() {
    const { currentUser } = useAuth()
    const { data, error } = useSWR('/api/users', fetcher)

    return {
        users: data,
        loading: !error && !data,
        error: error,
        setUsers: () => {
            throw new Error('setUsers is not supported with SWR. To mutate data, consider using mutate from SWR')
        }
    }
}
