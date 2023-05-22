import React, { useState } from 'react'
import Modal from './Modal'
import Link from 'next/link'

export default function Header() {
    const [openModal, setOpenModal] = useState(false)

    return (
        <>
            {openModal && <Modal setOpenModal={setOpenModal} />}
            <div className='50 sticky top-0 w-full left-0 bg-inherit flex items-center justify-between py-4 px-8 border-b border-solid border-white'>
                <Link href='/'><div><h1 className='text-3xl select-none sm:text-6xl'>

                    <span className='italian-green'> Italian</span>
                    {" "}App{" "}<span className='italian-red'>Dashboard</span> 
                     </h1></div> 
                </Link>
                <i onClick={() => setOpenModal(true)} className="fa-solid fa-user text-xl duration-300 hover:opacity-40 cursor-pointer sm:text-3xl"></i>

            </div>
        </>
    )
}
