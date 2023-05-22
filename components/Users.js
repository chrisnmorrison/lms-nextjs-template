import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import UserCard from "./UserCard";
import {
  doc,
  setDoc,
  deleteField,

} from "firebase/firestore";
import { db } from "../firebase";
import useFetchUsers from "../hooks/fetchUsers";
import { Link } from "@mui/material";
import { Button } from "@mui/material";

export default function UserDashboard() {
  const { userInfo, currentUser } = useAuth();
  const [edit, setEdit] = useState(null);
  const [edittedValue, setEdittedValue] = useState("");

  const { users, setUsers, loading, error } = useFetchUsers();

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

  function handleDelete(userKey) {
    return async () => {
      const tempObj = { ...users };
      delete tempObj[userKey];

      setUsers(tempObj);
      const userRef = doc(db, "users", currentUser.uid);
      await setDoc(
        userRef,
        {
          users: {
            [userKey]: deleteField(),
          },
        },
        { merge: true }
      );
    };
  }

  return (
    <div className="w-full max-w-[65ch] text-xs sm:text-sm mx-auto flex flex-col flex-1 gap-3 sm:gap-5">
      <div className="flex items-stretch">
        <h1 className="text-3xl">User List</h1>
      </div>
      {loading && (
        <div className="flex-1 grid place-items-center">
          <i className="fa-solid fa-spinner animate-spin text-6xl"></i>
        </div>
      )}
      <div className="current-users">
        {!loading && (
          <>
            {users.map((user, i) => {
              return (
                <UserCard
                  handleEditUser={handleEditUser(i)}
                  key={i}
                  handleAddEdit={handleAddEdit}
                  edit={edit}
                  userKey={user}
                  edittedValue={edittedValue}
                  setEdittedValue={setEdittedValue}
                  handleDelete={handleDelete}
                >
                  <h2 style={{ fontSize: "200%", marginBottom: ".5rem" }}>
                    {user.name}
                  </h2>
                  <p>{user.email}</p>
                </UserCard>
              );
            })}
            <div className="mt-5">
              <Link
                href="/AddUser"
                underline="hover"
                style={{ fontSize: "200%", marginBottom: ".5rem" }}
              >
                <Button size="large" variant="outlined">
                  Add New User
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
