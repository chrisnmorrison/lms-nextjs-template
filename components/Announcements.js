import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import UserCard from "./UserCard";
import { doc, setDoc, deleteField , deleteDoc} from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "@mui/material";
import { Button } from "@mui/material";
import useFetchAnnouncements from "../hooks/fetchAnnouncements";

export default function UserDashboard() {
  const { userInfo, currentUser } = useAuth();
  const [edit, setEdit] = useState(null);
  const [edittedValue, setEdittedValue] = useState("");

  const { announcements, setAnnouncements, isLoading, error } = useFetchAnnouncements();

  async function handleEditUser(i) {
    if (!edittedValue) {
      return;
    }
    const newKey = edit;
    setUsers({ ...users, [newKey]: edittedValue });
    const userRef = doc(db, "users", currentUser.uid);
    await setDoc(
      userRef,
      {
        users: {
          [newKey]: edittedValue,
        },
      },
      { merge: true }
    );
    setEdit(null);
    setEdittedValue("");
  }

  function handleAddEdit(userKey) {
    return () => {
      console.log(users[userKey]);
      setEdit(userKey);
      setEdittedValue(users[userKey]);
    };
  }

  const handleDelete = (docId) => {
    console.log("In delete function");
  
    // Display a confirmation alert to the user
    const confirmed = window.confirm("Are you sure you want to delete this announcement?");
  
    // If the user confirms the deletion, proceed with the deletion logic
    if (confirmed) {
      (async () => {
        try {
          // Get a reference to the announcement document to be deleted
          const announcementDocRef = doc(db, "announcements", docId);
  
          // Delete the announcement document from the "announcements" collection
          await deleteDoc(announcementDocRef);
  
          // Show a success message to the user
          alert("Announcement deleted successfully!");
  
          // If you are using the announcements state, update it accordingly
          // Assuming announcements is an array, and you have setAnnouncements function
          // setAnnouncements(announcements.filter((announcement) => announcement.id !== docId));
        } catch (error) {
          console.error("Error deleting announcement:", error);
          // Handle error and display an error message to the user
          alert("An error occurred while deleting the announcement.");
        }
      })();
    }
  };
  

  return (
    <div className="w-full  text-xs sm:text-sm mx-auto flex flex-col flex-1 gap-3 sm:gap-5">
      <div className="flex items-center">
        <h1 className="text-3xl">Announcements</h1>
      </div>
      {isLoading && (
        <div className="flex-1 grid place-items-center">
          <i className="fa-solid fa-spinner animate-spin text-6xl"></i>
        </div>
      )}
      <div className="announcements-list">
        {!isLoading && (
          <>
            <table className="table-dark">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Release Date</th>
                  <th>Expiry Date</th>
                  <th>Announcement Text</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {/* Iterate through announcements */}
                {announcements.map((announcement) => (
                  <tr key={announcement.id}>
                    <td>{announcement.title}</td>
                    <td>{announcement.releaseDate}</td>
                    <td>{announcement.expiryDate}</td>
                    <td>{announcement.text}</td>
                    <td className="flex">
                      {/* Add action buttons as needed */}
                      {/* <Link href={`/editAnnouncement/${announcement.id}`}>
                        <Button size="small" sx={{ mr: 1 }} variant="contained" color="success">
                          Edit Announcement
                        </Button>
                      </Link> */}
                      <Button
                        size="small"
                        color="error"
                        variant="contained"
                        onClick={() => handleDelete(announcement.id)} // Pass the announcement id as an argument
                      >
                        Delete Announcement
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Add a button to create a new announcement */}
            <div className="mt-5">
              <Link
                href="/addAnnouncement"
                underline="hover"
                style={{ fontSize: "200%", marginBottom: ".5rem" }}
              >
                <Button size="large" variant="outlined">
                  Add New Announcement
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export const GetServerSideProps = () => {};
