import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ChangePassword from "./change-password";
import { SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "sonner";
import { updateProfileApi } from "@/api/services/user/user-service";
import { useAuthStore } from "@/zustand-stores/auth.store";

type Inputs = {
  name?: string;
};

function UserUpdateProfile() {
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit } = useForm<Inputs>();
  const updateProfile = useAuthStore((state) => state.updateProfile);
  const onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
    const req: any = {};
    if (data.name?.trim().length) {
      req.name = data.name;
    }
    try {
      setIsLoading(true);
      const res = await updateProfileApi(req);
      setIsLoading(false);
      updateProfile(res.data);
      toast.success(res.message);
    } catch (error: any) {
      setIsLoading(false);
      toast.error(error.message);
    }
  };
  return (
    <>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>EDIT ACCOUNT</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-4">
              <Input placeholder="Display name" />
              <Input placeholder="Username" {...register("name")} />
              <Input placeholder="Full Name" />
              <Input placeholder="Email" />
              <Input placeholder="Secondary Email" />
              <Input placeholder="Phone Number" />
              <Input placeholder="Country/Region" />
              <div className="grid grid-cols-2 gap-4">
                <Input placeholder="States" />
                <Input placeholder="Zip Code" />
              </div>
            </div>
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700"
              type="submit"
            >
              {isLoading ? "Loading..." : "Save"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <ChangePassword />
    </>
  );
}

export default UserUpdateProfile;
