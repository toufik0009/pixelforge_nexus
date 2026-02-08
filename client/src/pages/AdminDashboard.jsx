import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import {
  FiBox,
  FiAlertCircle,
  FiCalendar,
  FiDollarSign,
  FiEye,
  FiPlus,
  FiCheckCircle,
  FiPieChart,
  FiArrowRight,
} from "react-icons/fi";

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("deadline");
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    pending: 0,
    completed: 0,
    onHold: 0,
    totalBudget: 0,
    teamMembers: 0,
    overdue: 0
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      setError("");
      setLoading(true);

      try {
        const res = await api.get("/projects");
        const productsData = res.data || [];
        setProducts(productsData);
        
        // Calculate statistics
        calculateStats(productsData);
      } catch (err) {
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const calculateStats = (productsData) => {
    const newStats = {
      total: productsData.length,
      active: productsData.filter(p => p.status === "active").length,
      pending: productsData.filter(p => p.status === "pending").length,
      completed: productsData.filter(p => p.status === "completed").length,
      onHold: productsData.filter(p => p.status === "on hold").length,
      totalBudget: productsData.reduce((sum, p) => sum + (p.budget || 0), 0),
      teamMembers: productsData.reduce((sum, p) => sum + (p.teamSize || 0), 0),
      overdue: productsData.filter(p => {
        if (!p.deadline || p.status === "completed") return false;
        return new Date(p.deadline) < new Date();
      }).length
    };
    setStats(newStats);
  };

  // Get recent products (last 6)
  const recentProducts = products.slice(0, 6);

  // Filter and sort recent products for display
  const filteredAndSortedProducts = recentProducts
    .filter((product) => {
      const matchesSearch =
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter =
        filterStatus === "all" || product.status === filterStatus;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return (a.name || "").localeCompare(b.name || "");
        case "deadline":
          return new Date(a.deadline) - new Date(b.deadline);
        case "status":
          return (a.status || "").localeCompare(b.status || "");
        default:
          return 0;
      }
    });

  // Get status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "on hold":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "No deadline";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Handle view all products
  const handleViewAll = () => {
    navigate("/products");
  };

  // Handle create new product
  const handleCreateProduct = () => {
    navigate("/create-product");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 px-4 py-8 pb-32">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-500 mt-1">
              Welcome back! Here's what's happening with your projects today.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={handleCreateProduct}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition font-medium shadow-lg shadow-blue-200"
            >
              <FiPlus />
              New Project
            </button>
            
          </div>
        </div>


        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Projects List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              {/* Projects Header */}
              <div className="px-6 py-5 border-b border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Recent Projects</h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Latest project updates and activities
                    </p>
                  </div>
                  <button
                    onClick={handleViewAll}
                    className="flex items-center gap-2 px-4 py-2.5 text-blue-600 hover:bg-blue-50 rounded-lg transition font-medium"
                  >
                    View All
                    <FiArrowRight />
                  </button>
                </div>

                {/* Quick Stats */}
                <div className="flex items-center gap-4">
                  {[
                    { label: "Active", value: stats.active, color: "bg-green-500" },
                    { label: "Pending", value: stats.pending, color: "bg-yellow-500" },
                    { label: "Completed", value: stats.completed, color: "bg-blue-500" },
                    { label: "On Hold", value: stats.onHold, color: "bg-orange-500" }
                  ].map((stat) => (
                    <div key={stat.label} className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${stat.color}`}></div>
                      <span className="text-sm text-gray-600">{stat.label}:</span>
                      <span className="text-sm font-semibold">{stat.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Projects List */}
              <div className="p-6">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
                    <p className="text-gray-600">Loading projects...</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-12">
                    <FiAlertCircle className="mx-auto text-red-400 mb-3" size={32} />
                    <p className="text-gray-600">{error}</p>
                  </div>
                ) : filteredAndSortedProducts.length === 0 ? (
                  <div className="text-center py-12">
                    <FiBox className="mx-auto text-gray-300 mb-3" size={48} />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                      No projects found
                    </h3>
                    <p className="text-gray-500 mb-6">
                      Create your first project to get started
                    </p>
                    <button
                      onClick={handleCreateProduct}
                      className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                    >
                      Create Project
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredAndSortedProducts.map((product) => (
                      <div
                        key={product._id}
                        className="group p-4 bg-gray-50 hover:bg-white rounded-xl border border-gray-200 hover:border-blue-200 hover:shadow-md transition-all duration-300 cursor-pointer"
                        onClick={() => navigate(`/products/${product._id}`)}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="p-2 bg-white rounded-lg">
                                <FiBox className="text-gray-600" size={18} />
                              </div>
                              <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition">
                                {product.name || "Untitled Project"}
                              </h3>
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-1">
                              {product.description || "No description available"}
                            </p>
                          </div>
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}
                          >
                            {product.status || "Unknown"}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                              <FiCalendar className="text-gray-400" size={14} />
                              <span className="text-xs text-gray-600">
                                {formatDate(product.deadline)}
                              </span>
                            </div>
                            {product.budget && (
                              <div className="flex items-center gap-2">
                                <FiDollarSign className="text-gray-400" size={14} />
                                <span className="text-xs text-gray-600">
                                  {formatCurrency(product.budget)}
                                </span>
                              </div>
                            )}
                          </div>
                          
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Stats & Actions */}
          <div className="space-y-6">
            {/* Status Distribution */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <FiPieChart className="text-blue-600" size={20} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Status Distribution
                </h3>
              </div>
              
              <div className="space-y-4">
                {[
                  { status: "Active", count: stats.active, color: "bg-green-500", percent: stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0 },
                  { status: "Pending", count: stats.pending, color: "bg-yellow-500", percent: stats.total > 0 ? Math.round((stats.pending / stats.total) * 100) : 0 },
                  { status: "Completed", count: stats.completed, color: "bg-blue-500", percent: stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0 },
                  { status: "On Hold", count: stats.onHold, color: "bg-orange-500", percent: stats.total > 0 ? Math.round((stats.onHold / stats.total) * 100) : 0 }
                ].map((item) => (
                  <div key={item.status} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${item.color}`}></div>
                        <span className="text-sm font-medium text-gray-700">
                          {item.status}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">
                        {item.count} ({item.percent}%)
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${item.color} rounded-full transition-all duration-500`}
                        style={{ width: `${item.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-green-50 rounded-lg">
                  <FiCheckCircle className="text-green-600" size={20} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Quick Actions
                </h3>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={handleCreateProduct}
                  className="w-full flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg">
                      <FiPlus className="text-blue-600" size={18} />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900">Create Project</p>
                      <p className="text-sm text-gray-500">Start a new project</p>
                    </div>
                  </div>
                  <FiArrowRight className="text-blue-600 opacity-0 group-hover:opacity-100 transition" />
                </button>
                
                <button
                  onClick={handleViewAll}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg">
                      <FiEye className="text-gray-600" size={18} />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900">View All Projects</p>
                      <p className="text-sm text-gray-500">See complete list</p>
                    </div>
                  </div>
                  <FiArrowRight className="text-gray-600 opacity-0 group-hover:opacity-100 transition" />
                </button>
               
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}