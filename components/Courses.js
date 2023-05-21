import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import CourseCard from './CourseCard'
import { doc, setDoc, deleteField, addDoc, collection } from 'firebase/firestore'
import { db } from '../firebase'
import useFetchCourses from '../hooks/fetchCourses'
import { Link } from '@mui/material'
import {Button} from '@mui/material'

export default function UserDashboard() {
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
              <h1 className='text-3xl'>Course List</h1>
               
       </div>
            {(loading) && (<div className='flex-1 grid place-items-center'>
                <i className="fa-solid fa-spinner animate-spin text-6xl"></i>
            </div>)}
            <div className='current-courses'>
            {(!loading) && (
                
                <>
                
                    {courses.map((course, i) => {
                        return (
                            <CourseCard handleEditCourse={handleEditCourse(i)} key={i} handleAddEdit={handleAddEdit} edit={edit} courseKey={course} edittedValue={edittedValue} setEdittedValue={setEdittedValue} handleDelete={handleDelete}>
                                <h2 style={{fontSize: "200%", marginBottom: '.5rem'}}>{course.name}</h2><p>{course.code}</p> 
                            </CourseCard>
                        )
                    })}
                    <div className='mt-5'>
  <Link href="/AddCourse" underline="hover" style={{fontSize: "200%", marginBottom: '.5rem'}}>
    <Button size="large" variant="outlined">Add New Course</Button>
  </Link>
</div>
                   
                </>
            )}</div>
            {/* {!addCourse && <button onClick={() => setAddCourse(true)} className='text-cyan-300 border border-solid border-cyan-300 py-2 text-center uppercase text-lg duration-300 hover:opacity-30'>ADD COURSE</button>} */}
        </div>
    )
}

export const GetServerSideProps = () =>{

}