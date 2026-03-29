import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartItemCount, toggleCart } = useCart();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-lg border-b border-gray-100 text-gray-900 transition-all font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 gap-4 sm:gap-8">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex flex-col justify-center items-start pt-1">
            <Link to="/" className="flex flex-col items-center group">
              <span className="font-light tracking-[0.2em] text-xl text-black leading-tight group-hover:text-gray-600 transition-colors">
                M A U R A
              </span>
            </Link>
          </div>

          {/* Search Bar - Minimalist */}
          <div className="hidden sm:flex flex-1 max-w-xl relative group">
            <input 
              type="text" 
              placeholder="Search modern essentials..." 
              className="w-full bg-gray-50/50 text-gray-900 px-5 py-2.5 rounded-full outline-none border border-gray-200 focus:border-gray-400 focus:bg-white transition-all placeholder-gray-400 text-sm font-light"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center text-gray-400 hover:text-black transition-colors rounded-full">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </button>
          </div>

          {/* Right section: Auth, Seller, Cart */}
          <div className="flex items-center space-x-2 sm:space-x-8">
            
            {/* User Dropdown */}
            <div className="relative" ref={dropdownRef}>
              {user ? (
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-1.5 font-light hover:text-gray-500 transition-colors py-2 focus:outline-none text-sm tracking-wide"
                >
                  {user.name}
                  <svg className={`w-3.5 h-3.5 transition-transform duration-300 ${isDropdownOpen ? 'transform rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" /></svg>
                </button>
              ) : (
                <Link to="/login" className="text-black px-6 py-2 text-sm font-medium tracking-wide uppercase border border-black hover:bg-black hover:text-white transition-all rounded-sm">
                  Sign In
                </Link>
              )}

              {/* Dropdown Menu */}
              {isDropdownOpen && user && (
                <div className="absolute top-full right-0 mt-3 w-56 bg-white/95 backdrop-blur shadow-[0_8px_30px_rgb(0,0,0,0.08)] text-gray-800 border border-gray-100 py-2 z-50 animate-fade-in-down origin-top rounded-lg">
                  <div className="absolute w-3 h-3 bg-white transform rotate-45 -top-1.5 right-6 border-l border-t border-gray-100"></div>
                  
                  <Link to={user.role === 'admin' ? '/admin' : user.role === 'seller' ? '/seller' : '/user/profile'} 
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-3 px-5 py-2.5 hover:bg-gray-50 transition-colors text-sm font-light">
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    Account
                  </Link>

                  {user.role === 'user' && (
                     <Link to="/user/orders" 
                           onClick={() => setIsDropdownOpen(false)}
                           className="flex items-center gap-3 px-5 py-2.5 hover:bg-gray-50 transition-colors text-sm font-light">
                       <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                       Orders
                     </Link>
                  )}
                  
                  {user.role === 'user' && (
                     <Link to="/apply-seller" 
                           onClick={() => setIsDropdownOpen(false)}
                           className="flex items-center gap-3 px-5 py-2.5 hover:bg-gray-50 transition-colors text-sm font-light">
                       <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                       Partner with us
                     </Link>
                  )}
                  
                  <div className="my-1 border-t border-gray-50"></div>

                  <button onClick={handleLogout} 
                          className="w-full flex items-center gap-3 px-5 py-2.5 hover:bg-gray-50 transition-colors text-sm font-light text-left text-red-600">
                    <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* Cart Button */}
            {(!user || user.role === "user") && (
              <button 
                onClick={toggleCart}
                className="flex items-center gap-2 font-light hover:text-gray-500 transition-colors py-2 focus:outline-none group"
              >
                <div className="relative">
                  <svg className="w-5 h-5 text-gray-800 group-hover:text-gray-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  {cartItemCount > 0 && (
                     <span className="absolute -top-1.5 -right-2 inline-flex items-center justify-center min-w-[16px] h-[16px] px-1 text-[9px] font-bold text-white bg-black rounded-full border border-white">
                      {cartItemCount}
                    </span>
                  )}
                </div>
                <span className="hidden sm:inline text-sm tracking-wide">Cart</span>
              </button>
            )}

          </div>
        </div>
        
        {/* Mobile Search Bar */}
        <div className="sm:hidden pb-3 pt-1">
          <div className="relative w-full">
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-full bg-gray-50 text-gray-900 px-4 py-2 rounded-full outline-none border border-gray-200 text-sm font-light focus:border-gray-400 transition-colors"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
