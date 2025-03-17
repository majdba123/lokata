import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ChangePassword from "./change-password";
import { SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "sonner";
import { updateProfileApi } from "@/api/services/user/user-service";
import { useAuthStore } from "@/zustand-stores/auth.store";
import { uploadFileApi } from "@/api/services/file-upload/file-upload-service";

type Inputs = {
  name?: string;
};

function UserUpdateProfile() {
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit } = useForm<Inputs>();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [, setSelectedFiles] = useState<File[]>([]);
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [newImageProfileUrl, setNewImageProfileUrl] = useState<string | null>(
    null
  );
  const updateProfile = useAuthStore((state) => state.updateProfile);

  const handleChooseFile = async (
    e: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    if (!e.target.files || e.target.files.length === 0) return;

    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    setPreviewImage(URL.createObjectURL(files[0]));

    // Call handleUpload with the files directly
    await handleUploadWithFiles(files);
  };

  const handleUploadWithFiles = async (files: File[]) => {
    if (files.length === 0) return;

    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`files[${index}]`, file);
    });

    try {
      setLoadingUpload(true);
      const res = await uploadFileApi(formData);
      setNewImageProfileUrl(res.urls[0]);
      setLoadingUpload(false);
      toast.success("File uploaded successfully");
    } catch (error: any) {
      toast.error(error.message);
      setLoadingUpload(false);
    }
  };

  const onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
    const req: any = {};
    if (data.name?.trim().length) {
      req.name = data.name;
    }

    if (newImageProfileUrl) {
      req.image = newImageProfileUrl;
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
            <div className="w-full">
              <Input className="w-full" placeholder="Username" {...register("name")} />
            </div>
            <div>
              <label htmlFor="files">
                Profile Image {loadingUpload && "Loading..."}
              </label>
              <input
                name="files"
                type="file"
                className="border border-gray-300 rounded-md p-2 w-full"
                onChange={handleChooseFile}
                accept="image/*"
                disabled={loadingUpload}
              />
              {/* preview the chosen images */}
              <div className="flex flex-wrap">
                {previewImage && (
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="mt-2 h[130px] w-[150px] rounded-full object-contain p-5 border-2"
                  />
                )}
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
