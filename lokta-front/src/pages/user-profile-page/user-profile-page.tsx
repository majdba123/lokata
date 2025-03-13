import ProfileSidebar from "./profile-side-bar";
import { Outlet } from "react-router-dom";

function UserProfilePage() {
  return (
    <>
      <div className="container mx-auto py-8 flex min-h-screen">
        <ProfileSidebar />
        <Outlet />
      </div>
    </>
  );
}

export default UserProfilePage;
