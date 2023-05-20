import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext';
import { doc, setDoc, deleteField, addDoc, collection, getDocs, getDoc } from 'firebase/firestore'
import { db } from '../../firebase';
import useFetchCourses from '../../hooks/fetchCourses';

export default function Page({ documentId, data }) {
    const [course, setCourse] = useState([])
    const { name, code } = document;

    const router = useRouter();
    return <>
    {/* <p>Course Code: {router.query.id}</p> */}
        <h1 className='lg-title mb-5'>Edit Course</h1>
        <form id="editCourseForm">
            <div>
            <label className="block text-white-700 text-lg font-bold mb-2" for="courseName">
        CourseName
      </label>                <input className='shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' type="text" id="courseName" name="courseName" required value={data.name} />
            </div>
            <div>
                <label className="block text-white-700 text-lg font-bold mb-2" for="courseCode">Course Code:</label>
                <input className='shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' type="text" id="courseCode" name="courseCode" required />
            </div>
            <div>
                <button type="submit">Submit</button>
            </div>
        </form>;</>
}

export const getServerSideProps = async (context) => {
    const { id } = context.query;
    try {
        const coursesCollection = collection(db, 'courses');
        const querySnapshot = await getDocs(coursesCollection);
        let documentId = null;
        let document = null;
        let data = null;

        querySnapshot.forEach((doc) => {
            const data = doc.data();
           
           
            if (data.code === id) {
                documentId = doc.id;
                document = doc;
            }
        });
        const docRef = doc(db, 'courses', documentId);
       
        const docSnapshot = await getDoc(docRef);
        if (docSnapshot.exists()) {
            data = docSnapshot.data();
        }
        return { props: { documentId, data } };
    } catch (error) {
        console.error('Error retrieving document ID:', error);
        throw error;
    }
};