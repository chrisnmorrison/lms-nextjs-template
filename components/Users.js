import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import UserCard from "./UserCard";
import { doc, setDoc, deleteField } from "firebase/firestore";
import { db } from "../firebase";
import useFetchUsers from "../hooks/fetchUsers";
import { Link } from "@mui/material";
import { Button } from "@mui/material";

export default function UserDashboard() {
  const { userInfo, currentUser } = useAuth();
  const [edit, setEdit] = useState(null);
  const [edittedValue, setEdittedValue] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchValue, setSearchValue] = useState("");

  const { users, setUsers, loading, error } = useFetchUsers();
  console.log(users);

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

  function handleSort(field) {
    if (sortField === field) {
      if (sortOrder === "asc") {
        setSortOrder("desc");
      } else if (sortOrder === "desc") {
        setSortOrder("");
      } else {
        setSortOrder("asc");
      }
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  }

  function renderSortArrow() {
    if (sortOrder === "") {
      return "↑↓";
    } else if (sortOrder === "asc") {
      return "↑↑";
    } else {
      return "↓↓";
    }
  }

  const sortedUsers = [...users];
  sortedUsers.sort((a, b) => {
    if (sortField === "isAdmin") {
      const fieldA = a[sortField] ? (a[sortField] ? 1 : 0) : 0;
      const fieldB = b[sortField] ? (b[sortField] ? 1 : 0) : 0;
      return sortOrder === "asc" ? fieldA - fieldB : fieldB - fieldA;
    } else {
      const fieldA = a[sortField] ? String(a[sortField]).toLowerCase() : "";
      const fieldB = b[sortField] ? String(b[sortField]).toLowerCase() : "";
      return sortOrder === "asc" ? fieldA.localeCompare(fieldB) : fieldB.localeCompare(fieldA);
    }
  });

  const filteredUsers = sortedUsers.filter(user =>
    Object.values(user).some(value =>
      value.toString().toLowerCase().includes(searchValue.toLowerCase())
    )
  );

  function handleSearchChange(event) {
    setSearchValue(event.target.value);
  }

  return (
    <div className="w-full  text-xs sm:text-sm mx-auto flex flex-col flex-1 gap-3 sm:gap-5">
      <div className="flex items-center">
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
            <span>Search for a user: </span><div className="search-bar mb-5">
              <input
                type="text"
                value={searchValue}
                onChange={handleSearchChange}
                placeholder="Search"
              />
            </div>
            <table className="table-dark">
              <thead>
                <tr>
                  <th>
                    <button onClick={() => handleSort("firstName")}>
                      First Name {sortField === "firstName" && renderSortArrow() ? renderSortArrow() : "↑↓"}
                    </button>
                  </th>
                  <th>
                    <button onClick={() => handleSort("lastName")}>
                      Last Name {sortField === "lastName" && renderSortArrow() ? renderSortArrow() : "↑↓"}
                    </button>
                  </th>
                  <th>
                    <button onClick={() => handleSort("studentNumber")}>
                      Student # {sortField === "studentNumber" && renderSortArrow() ? renderSortArrow() : "↑↓"}
                    </button>
                  </th>
                  <th>
                    <button onClick={() => handleSort("isAdmin")}>
                      Admin {sortField === "isAdmin" && renderSortArrow() ? renderSortArrow() : "↑↓"}
                    </button>
                  </th>
                  <th>
                    <button onClick={() => handleSort("email")}>
                      Email {sortField === "email" && renderSortArrow() ? renderSortArrow() : "↑↓"}
                    </button>
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, i) => (
                  <tr key={i}>
                    <td>{user.firstName ? user.firstName : ""}</td>
                    <td>{user.lastName ? user.lastName : ""}</td>
                    <td>{user.studentNumber}</td>
                    <td>{user.isAdmin ? "✅" : "❌"}</td>
                    <td>{user.email}</td>
                    <td className="flex">
                      <Link href={`/editUser/${user.id}`}>
                        <Button size="small" sx={{ mr: 0.5, ml: 0.5 }} variant="contained">
                          Edit User
                        </Button>
                      </Link>
                      <Button
                        size="small"
                        sx={{ ml: 0.5 }}
                        color="error"
                        variant="contained"
                        onClick={() => handleDelete(user.id)}
                      >
                        Delete User
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

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
