import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import CartDrawer from "./CartDrawer";

export default function StorefrontLayout() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 selection:bg-indigo-100 selection:text-indigo-900 flex flex-col">
      <Navbar />
      <CartDrawer />
      
      <main className="flex-1 w-full">
        <Outlet />
      </main>

      <footer className="bg-white border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <span className="font-extrabold text-2xl tracking-tight text-gray-900 flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">M</span>
                </div>
                Multi<span className="text-indigo-600">Vendor</span>
              </span>
              <p className="text-gray-500 text-sm max-w-xs">
                The perfect place to find amazing products from verified sellers around the globe. Premium quality, guaranteed.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-wider text-gray-900 uppercase mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Safety Center</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Community Guidelines</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-wider text-gray-900 uppercase mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Cookies Policy</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <p>© {new Date().getFullYear()} MultiVendor Platform. All rights reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <span>Made with ❤️ for students</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
