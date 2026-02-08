import { useContext, useEffect, useState } from "react";
import api from "../services/api";
import {
  FiBox,
  FiAlertCircle,
  FiCalendar,
  FiTag,
  FiUsers,
  FiDollarSign,
  FiTrendingUp,
  FiClock,
  FiSearch,
  FiFilter,
  FiChevronDown,
  FiEdit,
} from "react-icons/fi";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Products() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("deadline");

  useEffect(() => {
    const fetchProducts = async () => {
      setError("");
      setLoading(true);

      try {
        const res = await api.get("/projects");
        setProducts(res.data || []);
      } catch (err) {
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter and sort products
  const filteredAndSortedProducts = products
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-8 pb-32">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white rounded-xl shadow-sm">
              <FiBox size={28} className="text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Products</h1>
              <p className="text-gray-500 mt-1">
                Manage and monitor your projects
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">
              {filteredAndSortedProducts.length} products
            </span>
          </div>
        </div>

        {/* Summary Stats */}
        {filteredAndSortedProducts.length > 0 && (
          <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-700">
                  {products.filter((p) => p.status === "active").length}
                </div>
                <div className="text-sm text-blue-600">Active</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-700">
                  {products.filter((p) => p.status === "pending").length}
                </div>
                <div className="text-sm text-yellow-600">Pending</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-700">
                  {products.filter((p) => p.status === "completed").length}
                </div>
                <div className="text-sm text-green-600">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-700">
                  {products.length}
                </div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
            </div>
          </div>
        )}
        {/* Controls */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-3">
              <div className="relative">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="appearance-none bg-gray-50 border border-gray-200 rounded-xl py-3 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="on hold">On Hold</option>
                </select>
                <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-gray-50 border border-gray-200 rounded-xl py-3 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                >
                  <option value="deadline">Sort by Deadline</option>
                  <option value="name">Sort by Name</option>
                  <option value="status">Sort by Status</option>
                </select>
                <FiFilter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Loading products...</p>
            <p className="text-sm text-gray-400 mt-2">
              Please wait while we fetch your data
            </p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            <div className="w-16 h-16 mx-auto bg-red-50 rounded-full flex items-center justify-center mb-4">
              <FiAlertCircle size={32} className="text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Unable to Load Products
            </h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-medium"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && (
          <>
            {filteredAndSortedProducts.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                <FiBox size={64} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No products found
                </h3>
                <p className="text-gray-500">
                  {searchTerm || filterStatus !== "all"
                    ? "Try adjusting your search or filter to find what you're looking for."
                    : "No products have been added yet. Start by creating your first product!"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAndSortedProducts.map((product) => (
                  <div
                    key={product._id}
                    className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200"
                  >
                    {/* Card Header */}
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}
                          >
                            {product.status || "Unknown"}
                          </span>
                        </div>
                        {user.role === "admin" ? (
                          <div
                            className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-50 transition cursor-pointer"
                            onClick={() =>
                              navigate(`/create-product/${product._id}`)
                            }
                          >
                            <FiEdit className="text-blue-600 group-hover:text-blue-600 transition" />
                          </div>
                        ) : (
                          <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-blue-50 transition">
                            <FiBox className="text-gray-600 group-hover:text-blue-600 transition" />
                          </div>
                        )}
                      </div>

                      {/* Product Name */}
                      <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-1">
                        {product.name || "Untitled Product"}
                      </h2>

                      {/* Description */}
                      <p className="text-gray-600 mb-6 line-clamp-2 leading-relaxed">
                        {product.description ||
                          "No description available for this product."}
                      </p>

                      {/* Details Grid */}
                      <div className="grid grid-cols-2 gap-3 mb-6">
                        <div className="flex items-center gap-2">
                          <FiCalendar className="text-gray-400" />
                          <span className="text-sm text-gray-600">
                            Deadline
                          </span>
                        </div>
                        <div className="text-sm font-medium text-gray-900 text-right">
                          {formatDate(product.deadline)}
                        </div>

                        {product.budget && (
                          <>
                            <div className="flex items-center gap-2">
                              <FiDollarSign className="text-gray-400" />
                              <span className="text-sm text-gray-600">
                                Budget
                              </span>
                            </div>
                            <div className="text-sm font-medium text-gray-900 text-right">
                              ${product.budget.toLocaleString()}
                            </div>
                          </>
                        )}

                        {product.teamSize && (
                          <>
                            <div className="flex items-center gap-2">
                              <FiUsers className="text-gray-400" />
                              <span className="text-sm text-gray-600">
                                Team
                              </span>
                            </div>
                            <div className="text-sm font-medium text-gray-900 text-right">
                              {product.teamSize} members
                            </div>
                          </>
                        )}

                        {product.progress !== undefined && (
                          <>
                            <div className="flex items-center gap-2">
                              <FiTrendingUp className="text-gray-400" />
                              <span className="text-sm text-gray-600">
                                Progress
                              </span>
                            </div>
                            <div className="text-sm font-medium text-gray-900 text-right">
                              {product.progress}%
                            </div>
                          </>
                        )}
                      </div>

                      {/* Progress Bar (if progress exists) */}
                      {product.progress !== undefined && (
                        <div className="mb-6">
                          <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>Progress</span>
                            <span>{product.progress}%</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-600 rounded-full transition-all duration-300"
                              style={{ width: `${product.progress}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Tags */}
                      {product.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-6">
                          {product.tags.slice(0, 3).map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 text-xs"
                            >
                              <FiTag size={10} />
                              {tag}
                            </span>
                          ))}
                          {product.tags.length > 3 && (
                            <span className="text-xs text-gray-400">
                              +{product.tags.length - 3} more
                            </span>
                          )}
                        </div>
                      )}

                      {/* Footer */}
                      <div className="pt-4 border-t border-gray-100">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <FiClock className="text-gray-400" size={14} />
                            <span className="text-xs text-gray-500">
                              Updated{" "}
                              {product.lastUpdated
                                ? formatDate(product.lastUpdated)
                                : "Recently"}
                            </span>
                          </div>
                          <button className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition cursor-pointer"  onClick={() => navigate(`/products/${product._id}`)}>
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
