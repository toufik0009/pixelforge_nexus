import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  FiHome,
  FiBox,
  FiPlusSquare,
  FiUser,
  FiMenu,
  FiX
} from "react-icons/fi";
import { useState } from "react";

export default function Navbar() {
  const { user } = useContext(AuthContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    `flex flex-col items-center text-xs transition-all duration-200 px-2 py-1 rounded-lg ${
      isActive 
        ? "text-blue-600 bg-blue-50 font-medium" 
        : "text-gray-500 hover:text-blue-500 hover:bg-gray-50"
    }`;

  const desktopLinkClass = ({ isActive }) =>
    `px-4 py-2 rounded-lg transition-all duration-200 ${
      isActive 
        ? "text-blue-600 bg-white shadow-md font-semibold" 
        : "text-gray-600 hover:text-blue-500 hover:bg-white hover:shadow-sm"
    }`;

  return (
    <>
      {/* ===== DESKTOP TOP NAVBAR ===== */}
      <nav className="hidden md:flex justify-between items-center px-8 py-4 bg-gradient-to-r from-white to-blue-50 shadow-lg border-b border-blue-100">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          PixelForge Nexus
        </h1>

        <div className="flex gap-8 items-center">
          <NavLink to="/" className={desktopLinkClass}>
            Home
          </NavLink>
          
          <NavLink to="/products" className={desktopLinkClass}>
            Products
          </NavLink>

          {user?.role === "admin" && (
            <NavLink to="/create-product" className={desktopLinkClass}>
              Create Product
            </NavLink>
          )}

          <NavLink to="/profile" className={desktopLinkClass}>
            Profile
          </NavLink>
        </div>
      </nav>

      {/* ===== MOBILE TOP NAVBAR (with hamburger menu) ===== */}
      <nav className="md:hidden flex justify-between items-center px-4 py-3 bg-gradient-to-r from-white to-blue-50 shadow-lg border-b border-blue-100">
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          PixelForge Nexus
        </h1>

        {/* Hamburger Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
        >
          {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-white border-t border-blue-100 shadow-lg z-40">
            <div className="flex flex-col p-4 space-y-2">
              <NavLink 
                to="/" 
                className={({ isActive }) => 
                  `px-4 py-3 rounded-lg ${
                    isActive 
                      ? "text-blue-600 bg-blue-50 font-semibold" 
                      : "text-gray-600 hover:bg-gray-50"
                  }`
                }
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </NavLink>
              
              <NavLink 
                to="/products" 
                className={({ isActive }) => 
                  `px-4 py-3 rounded-lg ${
                    isActive 
                      ? "text-blue-600 bg-blue-50 font-semibold" 
                      : "text-gray-600 hover:bg-gray-50"
                  }`
                }
                onClick={() => setMobileMenuOpen(false)}
              >
                Products
              </NavLink>

              {user?.role === "admin" && (
                <NavLink 
                  to="/create-product" 
                  className={({ isActive }) => 
                    `px-4 py-3 rounded-lg ${
                      isActive 
                        ? "text-blue-600 bg-blue-50 font-semibold" 
                        : "text-gray-600 hover:bg-gray-50"
                    }`
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Create Product
                </NavLink>
              )}

              <NavLink 
                to="/profile" 
                className={({ isActive }) => 
                  `px-4 py-3 rounded-lg ${
                    isActive 
                      ? "text-blue-600 bg-blue-50 font-semibold" 
                      : "text-gray-600 hover:bg-gray-50"
                  }`
                }
                onClick={() => setMobileMenuOpen(false)}
              >
                Profile
              </NavLink>
            </div>
          </div>
        )}
      </nav>

      {/* ===== MOBILE BOTTOM TAB BAR ===== */}
      <nav className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-white to-blue-50 border-t border-blue-100 shadow-2xl md:hidden z-50">
        <div className="flex justify-around py-3 px-1">
          <NavLink to="/" className={linkClass}>
            <FiHome size={24} />
            <span className="mt-1">Home</span>
          </NavLink>

          <NavLink to="/products" className={linkClass}>
            <FiBox size={24} />
            <span className="mt-1">Products</span>
          </NavLink>

          {user?.role === "admin" && (
            <NavLink to="/create-product" className={linkClass}>
              <FiPlusSquare size={24} />
              <span className="mt-1">Create</span>
            </NavLink>
          )}

          <NavLink to="/profile" className={linkClass}>
            <FiUser size={24} />
            <span className="mt-1">Profile</span>
          </NavLink>
        </div>
      </nav>
    </>
  );
}