import React from 'react'
import { styled } from 'styled-components'
import Link from 'next/link'
import { FcHome, FcNews, FcConferenceCall, FcAnswers } from "react-icons/fc";

export default function Sidebar() {

    return (
        <Styles> <aside id="default-sidebar" className="fixed top-0 left-0 z-40 h-screen transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">
        <div className="sidebar-items h-full px-3 py-4 overflow-y-auto ">
           <ul className="space-y-2 mt-4 font-medium">
              <li className="inline-block cursor-pointer inline-flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                 <Link href="/" >
                <div className='inline-flex'> <FcHome className='sidebar-icon'/>
                    <span className="ml-3">Home</span></div>   
                 </Link>
              </li>
              <li className="inline-block cursor-pointer inline-flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                 <Link href="/courses" >
                   <div className='inline-flex'> <FcNews className='sidebar-icon'/>
                    <span className="inline-flex-1 ml-3 whitespace-nowrap">Courses</span></div>
                 </Link>
              </li>
              
              <li className="cursor-pointer inline-flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                 <Link href="/users" >
                   <div  className='inline-flex'><FcConferenceCall className='sidebar-icon'/>
                    <span className="inline-flex-1 ml-3 whitespace-nowrap">Manage Users</span></div>
                    
                 </Link>
              </li>
              <li className="cursor-pointer inline-flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                 <Link href="/test" >
                   <div  className='inline-flex'><FcAnswers className='sidebar-icon'/>
                    <span className="inline-flex-1 ml-3 whitespace-nowrap">Test</span></div>
                    
                 </Link>
              </li> 
            
           </ul>
        </div>
     </aside></Styles>

    )
}

const Styles = styled.div`

border-right: 1px solid white;
width: 15vw;
height: 100vw;
`
