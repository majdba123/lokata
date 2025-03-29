import { useState } from "react";
import { Button } from "@/components/ui/button";
import UserUpdateProfile from "./user-update-profile";
import { useAuthStore } from "@/zustand-stores/auth.store";
import { IMAGES_API_URL } from "@/api/constants";

function ProfileDashboard() {
  const [inEdit, setInEdit] = useState(false);
  const user = useAuthStore((state) => state.user);

  const handleEdit = () => {
    setInEdit(!inEdit);
  };

  return (
    <div dir="rtl" className="mx-auto  p-8 ">
      <div className="flex-grow">
        <main className="flex-1">
          <h1 className="text-2xl font-semibold mb-6">
            مرحبا، {user?.name}
          </h1>
          <p className="text-gray-600 mb-8">
            من لوحة تحكم حسابك، يمكنك بسهولة التحقق من أحدث طلباتك وعرضها، وإدارة
            عناوين الشحن والفواتير، وتعديل كلمة المرور وتفاصيل الحساب
          </p>
          <div className="bg-white p-6 rounded-lg shadow mb-8">
            <h2 className="text-xl font-semibold mb-4">معلومات الحساب</h2>
            <div className="flex items-center space-x-4">
              {user?.image ? (
                <img
                  src={`${IMAGES_API_URL}/${user?.image}`}
                  alt="Profile"
                  className="h-20 w-20 rounded-full object-contain"
                />
              ) : (
                <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400 text-4xl">؟</span>
                </div>
              )}
              <div>
                <h3 className="font-semibold">{user?.name}</h3>
                <p className="text-gray-500">البريد الإلكتروني: {user?.email}</p>
              </div>
            </div>
            <Button variant="outline" className="mt-4" onClick={handleEdit}>
              {inEdit ? "إلغاء" : "تعديل الحساب"}
            </Button>
          </div>
        </main>
      </div>
      {inEdit && <UserUpdateProfile />}
    </div>
  );
}

export default ProfileDashboard;
