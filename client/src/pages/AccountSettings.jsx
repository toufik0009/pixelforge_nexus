import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  FiUser,
  FiMail,
  FiShield,
  FiLogOut,
  FiKey,
  FiEdit2,
  FiCheckCircle
} from "react-icons/fi";

export default function AccountSettings() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 px-4 py-8 pb-32">
      <div className="max-w-xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        
        {/* Header */}
        <div className="relative px-8 pt-8 pb-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <div className="absolute -top-4 -left-4 w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl transform -rotate-6"></div>
          <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-white/10 backdrop-blur-sm rounded-xl transform rotate-12"></div>
          
          <div className="relative flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg border border-white/30">
              <FiUser className="text-white" size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                Account Settings
              </h2>
              <p className="text-sm text-blue-100 mt-1">
                Manage your profile and security
              </p>
            </div>
            <button className="ml-auto p-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl transition-all duration-300 hover:scale-105">
              <FiEdit2 className="text-white" size={20} />
            </button>
          </div>
        </div>

        {/* User Info */}
        <div className="px-8 py-8 space-y-6">
          <div className="group flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-r from-gray-50 to-white border border-gray-200 hover:border-blue-200 hover:shadow-lg transition-all duration-300">
            <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl group-hover:scale-105 transition-transform">
              <FiUser className="text-blue-600" size={22} />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Name</p>
              <p className="text-lg font-semibold text-gray-900 mt-1">
                {user.name}
              </p>
            </div>
            <FiCheckCircle className="text-green-500" size={20} />
          </div>

          <div className="group flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-r from-gray-50 to-white border border-gray-200 hover:border-blue-200 hover:shadow-lg transition-all duration-300">
            <div className="p-3 bg-gradient-to-br from-purple-100 to-purple-50 rounded-xl group-hover:scale-105 transition-transform">
              <FiMail className="text-purple-600" size={22} />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Email</p>
              <p className="text-lg font-semibold text-gray-900 mt-1">
                {user.email}
              </p>
            </div>
            <FiCheckCircle className="text-green-500" size={20} />
          </div>

          <div className="group flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-r from-gray-50 to-white border border-gray-200 hover:border-blue-200 hover:shadow-lg transition-all duration-300">
            <div className="p-3 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-xl group-hover:scale-105 transition-transform">
              <FiShield className="text-emerald-600" size={22} />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Role</p>
              <p className="text-lg font-semibold text-gray-900 mt-1">
                <span className="inline-flex items-center py-1 rounded-full text-emerald-700 text-sm font-medium capitalize">
                  {user.role}
                </span>
              </p>
            </div>
          </div>

          {user.id && (
            <div className="group flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-r from-gray-50 to-white border border-gray-200 hover:border-blue-200 hover:shadow-lg transition-all duration-300">
              <div className="p-3 bg-gradient-to-br from-amber-100 to-amber-50 rounded-xl group-hover:scale-105 transition-transform">
                <FiKey className="text-amber-600" size={22} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">User ID</p>
                <p className="text-sm font-mono text-gray-700 mt-1 break-all bg-gray-50 px-3 py-2 rounded-lg">
                  {user.id}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="px-8 py-4">
          <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
        </div>

        {/* Logout */}
        <div className="px-8 pb-8">
          <button
            onClick={handleLogout}
            className="group w-full flex items-center justify-center gap-3 bg-gradient-to-r from-red-500 to-red-600 text-white py-4 px-6 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className="relative">
              <FiLogOut size={22} className="group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 bg-white/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <span className="font-semibold text-lg tracking-wide">Sign Out</span>
            <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
            </div>
          </button>
          
          {/* Footer Note */}
          <p className="text-center text-xs text-gray-400 mt-6 pt-4 border-t border-gray-100">
            Last updated • Just now
          </p>
        </div>
      </div>
    </div>
  );
}