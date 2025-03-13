import "./App.css";
import Header from "@/layout/header";
import Navbar from "@/layout/nav-bar";
import Footer from "./layout/footer";
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
import { Toaster } from "@/components/ui/sonner";
import RequireAuth from "./pages/require-auth/require-auth";
import VerifyOtp from "./pages/auth-page/verify-otp";

function App() {
  return (
    <>
      <Header />
      <Navbar />
      {/* body */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <Toaster />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/category/:id" element={<CategoryPage />} />
          <Route element={<RequireAuth />}>
            <Route path="/profile" element={<UserProfilePage />}>
              <Route path="dashboard" element={<ProfileDashboard />} />
              <Route path="create-product" element={<CreateProduct />} />
              <Route path="create-brand" element={<CreateBrand />} />
            </Route>
          </Route>

          <Route element={<AuthPage />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Signup />} />
            <Route path="forget-password" element={<ForgetPassword />} />
          </Route>
          <Route path="/verify-otp" element={<VerifyOtp />} />
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
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
