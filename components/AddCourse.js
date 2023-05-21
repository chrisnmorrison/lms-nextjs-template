import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import CourseCard from './CourseCard'
import { doc, setDoc, deleteField, addDoc, collection } from 'firebase/firestore'
import { db } from '../firebase'
import useFetchCourses from '../hooks/fetchCourses'
import { useRouter } from "next/router";

export default function UserDashboard() {
    const router = useRouter()
    const { userInfo, currentUser } = useAuth()
    const [edit, setEdit] = useState(null)
    const [course, setCourse] = useState([])
    const [edittedValue, setEdittedValue] = useState('')

    const { courses, setCourses, loading, error } = useFetchCourses()



    //console.log(courses)

    // useEffect(() => {
    //     if (!userInfo || Object.keys(userInfo).length === 0) {
    //         setAddCourse(true)
    //     }
    // }, [userInfo])

    async function handleAddCourse() {
        if (!course) { return }
        const docRef = await addDoc(collection(db, 'courses'), course)
        setCourse('')
        router.push('/courses')
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
            <div className='flex items-stretch'>
                <div className="w-full">
                    <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" >
                                Course Name
                            </label>
                            <input value={course.name}   onChange={(e) => setCourse({ ...course, name: e.target.value })} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="courseName" type="text" placeholder="Course Name" />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" >
                                Course Code
                            </label>
                            <input value={course.code}   onChange={(e) => setCourse({ ...course, code: e.target.value })} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="courseCode" placeholder='Course Code' />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" >
                                Course Description
                            </label>
                            <textarea rows="4" value={course.description}   onChange={(e) => setCourse({ ...course, description: e.target.value })} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="courseName" type="text" placeholder="Course Description" />
                        </div>
                        <div className="flex items-center justify-between">
                            <button onClick={handleAddCourse} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
                                Submit
                            </button>

                        </div>
                    </form>

                </div>
                {/* <input type='text' placeholder="Enter course" value={course} onChange={(e) => setCourse(e.target.value)} className="outline-none p-3 text-base sm:text-lg text-slate-900 flex-1" />
                <button onClick={handleAddCourse} className='w-fit px-4 sm:px-6 py-2 sm:py-3 bg-amber-400 text-white font-medium text-base duration-300 hover:opacity-40'>ADD</button>
          */}  </div>
           
           
        </div>
    )
}

export const GetServerSideProps = () =>{

}