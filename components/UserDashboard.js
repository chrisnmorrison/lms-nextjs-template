import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import CourseCard from './CourseCard'
import { doc, setDoc, deleteField, addDoc, collection } from 'firebase/firestore'
import { db } from '../firebase'
import useFetchCourses from '../hooks/fetchCourses'

export default function UserDashboard() {
    const { userInfo, currentUser } = useAuth()
    const [edit, setEdit] = useState(null)
    const [course, setCourse] = useState([])
    const [edittedValue, setEdittedValue] = useState('')

    const { courses, setCourses, loading, error } = useFetchCourses()




    async function handleAddCourse() {
        if (!course) { return }
        const docRef = await addDoc(collection(db, 'courses'), course)
        setCourse('')
    }

    async function handleEditCourse(i) {
        if (!edittedValue) { return }
        const newKey = edit
        setCourses({ ...courses, [newKey]: edittedValue })
        const userRef = doc(db, 'courses', currentUser.uid)
        await setDoc(userRef, {
            'courses': {
                [newKey]: edittedValue
            }
        }, { merge: true })
        setEdit(null)
        setEdittedValue('')
    }

    function handleAddEdit(courseKey) {
        return () => {
            console.log(courses[courseKey])
            setEdit(courseKey)
            setEdittedValue(courses[courseKey])
        }
    }

    function handleDelete(courseKey) {
        return async () => {
            const tempObj = { ...courses }
            delete tempObj[courseKey]

            setCourses(tempObj)
            const userRef = doc(db, 'courses', currentUser.uid)
            await setDoc(userRef, {
                'courses': {
                    [courseKey]: deleteField()
                }
            }, { merge: true })

        }
    }

    return (
        <div className='w-full max-w-[65ch] text-xs sm:text-sm mx-auto flex flex-col flex-1 gap-3 sm:gap-5'>
            <h1 className="text-center text-3xl">Home</h1>
        </div>
    )
}

export const GetServerSideProps = () =>{

}