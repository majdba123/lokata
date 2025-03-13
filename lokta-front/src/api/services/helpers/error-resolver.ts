import { AxiosError } from "axios";

export const resolveError = (error: any) => {
  let msg = "An error occurred";
  console.log(error);
  if (error instanceof AxiosError) {
    error = error.response?.data;
    if (error.errors) {
      msg = "   ";
      Object.values(error.errors).forEach((e: any) => {
        msg += ` ${e}`;
      });
    } else if (error.message) {
      msg = error.message;
    }
  }
  return msg;
};
