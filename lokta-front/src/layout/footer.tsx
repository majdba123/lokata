import logo from "@/assets/lokta-logo.svg";
import {
  MapPin,
  PhoneCall,
  Mail,
  Facebook,
  Twitter,
  Instagram,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center mb-4">
              <img src={logo} alt="Lokta Logo" className="h-8 mr-2" />
              <span className="font-bold text-xl">LOKTA</span>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              A marketplace for buying and selling everything - from cars and
              real estate to electronics and fashion.
            </p>
            <div className="flex space-x-2">
              <a href="#" className="text-gray-400 hover:text-gray-600">
                <Facebook />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-600">
                <Twitter />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-600">
                <Instagram />
              </a>
            </div>
          </div>

          {/* Useful Links */}
          <div className="md:col-span-1">
            <h3 className="font-semibold mb-4">Useful Link</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  Your Order
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  Your Account
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  Your Wishlist
                </a>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="md:col-span-1">
            <h3 className="font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  Real Estate
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  Electronics
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  Fashion & Clothing
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  Home & Furniture
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  Games
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  Tickets & Events
                </a>
              </li>
            </ul>
          </div>

          {/* Store Information */}
          <div className="md:col-span-1">
            <h3 className="font-semibold mb-4">Store Information</h3>
            <div className="flex items-center mb-2">
              <MapPin className="h-4 w-4 mr-2 text-gray-500" />
              <span className="text-sm text-gray-600">Location</span>
            </div>
            <div className="flex items-center mb-2">
              <PhoneCall className="h-4 w-4 mr-2 text-gray-500" />
              <span className="text-sm text-gray-600">
                Call Us: 123-456-7890
              </span>
            </div>
            <div className="flex items-center">
              <Mail className="h-4 w-4 mr-2 text-gray-500" />
              <span className="text-sm text-gray-600">
                Email Us: lokta@123.com
              </span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center mt-8 text-sm text-gray-500">
          ©2025 LOKTA. All Rights Reserved. Designed & Developed by High Level
          Technology.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
