import "./App.css";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/home-page/home-page";
import CategoryPage from "./pages/category-page/category-page";
import UserProfilePage from "./pages/user-profile-page/user-profile-page";
import ProfileDashboard from "./pages/user-profile-page/profile-dashboard";
import AuthPage from "./pages/auth-page/auth-page";
import Login from "./pages/auth-page/login";
import Signup from "./pages/auth-page/signup";
import ForgetPassword from "./pages/auth-page/forget-password";
import CreateBrand from "./pages/vendor-pages/create-brand/create-brand";
import CreateProduct from "./pages/vendor-pages/create-product/create-product";
import RequireAuth from "./pages/require-auth/require-auth";
import VerifyOtp from "./pages/auth-page/verify-otp";
import ChatPage from "./pages/chat-page/chat-page";
import ChatArea from "./pages/chat-page/chat-area";
import PageLayout from "./layout/page-layout";
import TyrePage from "./pages/tyre-page/tyre-page";
import { Toaster } from "sonner";
import MyProducts from "./pages/user-profile-page/my-products";
import ProductPage from "./pages/product-page";

function App() {
  return (
    <>
      <Toaster />
      <Routes>
        <Route element={<PageLayout />}>
          <Route path="/" element={<HomePage />} />
        </Route>

        <Route element={<PageLayout />}>
          <Route path="/category" element={<CategoryPage />} />
        </Route>
        <Route element={<PageLayout />}>
          <Route element={<RequireAuth />}>
            <Route path="/profile" element={<UserProfilePage />}>
              <Route path="dashboard" element={<ProfileDashboard />} />
              <Route path="create-product" element={<CreateProduct />} />
              <Route path="create-brand" element={<CreateBrand />} />
              <Route path="create-brand" element={<CreateBrand />} />
              <Route path="my-products" element={<MyProducts />} />
            </Route>
          </Route>{" "}
        </Route>

        <Route element={<PageLayout />}>
          <Route element={<AuthPage />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Signup />} />
            <Route path="forget-password" element={<ForgetPassword />} />
          </Route>
        </Route>
        <Route element={<PageLayout />}>
          <Route path="/verify-otp" element={<VerifyOtp />} />
        </Route>

        <Route element={<PageLayout />}>
          <Route
            path="*"
            element={
              <h1
                className="
          text-3xl
          text-center
          text-gray-500
          "
              >
                Under Development
              </h1>
            }
          />
        </Route>
        <Route element={<PageLayout />}>
          <Route path="/tyre" element={<TyrePage />} />
        </Route>
        <Route element={<PageLayout />}>
          <Route path="/product/:id" element={<ProductPage />} />
        </Route>
        <Route element={<RequireAuth />}>
          <Route path="chat" element={<ChatPage />}>
            <Route path=":id" element={<ChatArea />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
