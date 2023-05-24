import { useAuth } from '../context/AuthContext'
import { db } from '../firebase'
import { collection, getDocs } from 'firebase/firestore'
import useSWR from 'swr'

const fetchCourses = async () => {
  const coursesCollection = collection(db, 'courses')
  const coursesSnapshot = await getDocs(coursesCollection)
  const coursesData = coursesSnapshot.docs.map((doc) => doc.data())
  return coursesData
}

export default function useFetchCourses() {
  const { currentUser } = useAuth()
  const { data: courses, error } = useSWR(currentUser ? 'courses' : null, fetchCourses)

  return {
    courses: courses || [],
    isLoading: !error && !courses,
    isError: error,
  }
}
