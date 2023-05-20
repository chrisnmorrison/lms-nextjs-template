import React from 'react'
import { Button } from '@mui/material'
import Link from 'next/link'

export default function CourseCard(props) {
    console.log(props)
    const { children, edit, handleAddEdit, edittedValue, setEdittedValue, courseKey, handleEditCourse, handleDelete } = props




    return (
        <div className='p-2 relative sm:p-3 border flex items-stretch border-white border-solid '>

            <div className='flex-1 flex flex-col'>
                {!(edit === courseKey) ? <>{children}</> : (
                    <input className='bg-inherit flex-1 text-white outline-none' value={edittedValue} onChange={(e) => setEdittedValue(e.target.value)} />
                )}
                {/* {children} */}
            </div>
           <Link href={`editCourse/${courseKey.code}`}><Button variant="contained">Edit Course</Button></Link>
        </div>
    )
}
