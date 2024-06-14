import React, { useState } from "react";
import UserList from "./UserViewComponents/UserList";
import { getUserInfo } from "@/app/lib/firebase/firebase";
import UserEdit from "./UserViewComponents/UserEdit";

function UserView() {
  const [userViews, setUserViews] = useState("list");
  const [userData, setUserData] = useState({});

  const handleEditProfile = async (data) => {
    setUserData(data);
    setUserViews("edit");
  };
  return (
    <div className="container">
      <div className="max-w-screen-md mx-auto p-6 bg-white rounded-lg shadow-lg">
        {userViews === "list" && (
          <UserList onClicked={(e) => handleEditProfile(e)} />
        )}
        {userViews === "edit" && (
          <UserEdit userData={userData} onBack={() => setUserViews("list")} />
        )}
      </div>
    </div>
  );
}

export default UserView;
