import ProfileSidebar from "./profile-side-bar";
import { Outlet } from "react-router-dom";

function UserProfilePage() {
  return (
    <div dir="rtl">
      <div className="container mx-auto py-8 flex min-h-screen">
        <ProfileSidebar />
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default UserProfilePage;
