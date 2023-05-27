import React from 'react'
import Footer from './Footer'
import Header from './Header'
import Sidebar from './Sidebar'

export default function Layout(props) {
    const { children } = props
    return (
        <div className='flex flex-col min-h-screen relative bg-neutral-800 text-white'> 
        <Header/><div className='sidebar-and-main'> <Sidebar/>
        <main className='flex-1 flex flex-col p-4 inline-block max-w-[60rem] mx-auto'>
            {children}
        </main></div>
       
        <Footer/>
        </div>
    )
}
