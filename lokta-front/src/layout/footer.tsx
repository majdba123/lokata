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
    <footer dir="rtl" className="bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center mb-4 ">
              <img src={logo} alt="Lokta Logo" className="h-8 ml-2" />
              <span className="font-bold text-xl">Lokta</span>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              سوق لشراء وبيع كل شيء - من السيارات والعقارات إلى الإلكترونيات
              والموضة.
            </p>
            <div className="flex  space-x-2">
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
            <h3 className="font-semibold mb-4">روابط مفيدة</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  طلبك
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  حسابك
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  قائمة امنياتك
                </a>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="md:col-span-1">
            <h3 className="font-semibold mb-4">الفئات</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  عقارات
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  إلكترونيات
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  أزياء وملابس
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  المنزل والأثاث
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  ألعاب
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  تذاكر وفعاليات
                </a>
              </li>
            </ul>
          </div>

          {/* Store Information */}
          <div className="md:col-span-1">
            <h3 className="font-semibold mb-4">معلومات المتجر</h3>
            <div className="flex items-center mb-2 ">
              <MapPin className="h-4 w-4 ml-2 text-gray-500" />
              <span className="text-sm text-gray-600">الموقع</span>
            </div>
            <div className="flex items-center mb-2 ">
              <PhoneCall className="h-4 w-4 ml-2 text-gray-500" />
              <span className="text-sm text-gray-600">
                اتصل بنا: 123-456-7890
              </span>
            </div>
            <div className="flex items-center ">
              <Mail className="h-4 w-4 ml-2 text-gray-500" />
              <span className="text-sm text-gray-600">
                راسلنا عبر البريد الإلكتروني: lokta@123.com
              </span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center mt-8 text-sm text-gray-500">
          ©2025 Lokta. جميع الحقوق محفوظة.
        </div>
        <div className="text-center mt-2 text-sm text-gray-500">
          تصميم وتطوير{" "}
          <a
            href="https://highleveltecknology.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            High Level Technology
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
