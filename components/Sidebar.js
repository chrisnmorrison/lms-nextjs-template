import React from "react";
import Link from "next/link";
import {
  FcHome,
  FcNews,
  FcConferenceCall,
  FcOrgUnit,
  FcTodoList
} from "react-icons/fc";

export default function Sidebar() {
  return (
    <aside
      id="default-sidebar"
      className=" z-40 h-screen transition-transform -translate-x-full sm:translate-x-0"
      aria-label="Sidebar"
    >
      <div className="sidebar-items h-full px-3 py-4 overflow-y-auto ">
       
        <ul className="space-y-2 font-medium">
          <div>
            {" "}
            <li className="inline-block cursor-pointer inline-flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
              <Link href="/">
                <div className="inline-flex">
                  {" "}
                  <FcHome className="sidebar-icon" />
                  <span className="ml-3">Home</span>
                </div>
              </Link>
            </li>
          </div>
          <div>
            {" "}
            <li className="inline-block cursor-pointer inline-flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
              <Link href="/courses">
                <div className="inline-flex">
                  {" "}
                  <FcNews className="sidebar-icon" />
                  <span className="inline-flex-1 ml-3 whitespace-nowrap">
                    Courses
                  </span>
                </div>
              </Link>
            </li>
          </div>

          <div>
            {" "}
            <li className="cursor-pointer inline-flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
              <Link href="/users">
                <div className="inline-flex">
                  <FcConferenceCall className="sidebar-icon" />
                  <span className="inline-flex-1 ml-3 whitespace-nowrap">
                    Manage Users
                  </span>
                </div>
              </Link>
            </li>
          </div>
          <div>
            {" "}
            <li className="cursor-pointer inline-flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
              <Link href="/announcements">
                <div className="inline-flex">
                  <FcOrgUnit className="sidebar-icon" />
                  <span className="inline-flex-1 ml-3 whitespace-nowrap">
                    Announcements
                  </span>
                </div>
              </Link>
            </li>
          </div>
          <div>
            <li className="cursor-pointer inline-flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
              <Link href="/RegistrationRequests">
                <div className="inline-flex">
                  <FcTodoList className="sidebar-icon" />
                  <span className="inline-flex-1 ml-3 whitespace-nowrap">
                    Registration Requests
                  </span>
                </div>
              </Link>
            </li>
          </div>
          {/* <div>
            {" "}
            <li className="cursor-pointer inline-flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
              <Link href="/videos">
                <div className="inline-flex">
                  <FcClapperboard className="sidebar-icon" />
                  <span className="inline-flex-1 ml-3 whitespace-nowrap">
                    Videos
                  </span>
                </div>
              </Link>
            </li>
          </div>
          <div>
            <li className="cursor-pointer inline-flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
              <Link href="/test">
                <div className="inline-flex">
                  <FcAnswers className="sidebar-icon" />
                  <span className="inline-flex-1 ml-3 whitespace-nowrap">
                    Test
                  </span>
                </div>
              </Link>
            </li>{" "}
          </div> */}
        </ul>
      </div>
    </aside>
  );
}
