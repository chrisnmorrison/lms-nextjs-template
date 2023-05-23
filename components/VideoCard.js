import React from 'react'
import { Button } from '@mui/material'
import Link from 'next/link'

export default function VideoCard(props) {
    const { children, edit, edittedValue, setEdittedValue, videoKey } = props




    return (
        <div className='p-2 relative sm:p-3 border flex items-stretch border-white border-solid '>

            <div className='flex-1 flex flex-col'>
                {!(edit === videoKey) ? <>{children}</> : (
                    <input className='bg-inherit flex-1 text-white outline-none' value={edittedValue} onChange={(e) => setEdittedValue(e.target.value)} />
                )}
                {/* {children} */}
            </div>
           <Link href={`editVideo/${videoKey.id}`}><Button variant="contained">Edit Video</Button></Link>
        </div>
    )
}
