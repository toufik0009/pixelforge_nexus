import { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import {
  FiArrowLeft,
  FiBox,
  FiFileText,
  FiCalendar,
  FiTag,
  FiEdit,
  FiTrash2,
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
  FiPauseCircle,
  FiLoader
} from "react-icons/fi";
import { AuthContext } from "../context/AuthContext";

export default function ProductDetails() {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/projects/${id}`);
      setProduct(response.data);
    } catch (err) {
      setError("Failed to load project details");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this project?")) {
      return;
    }

    try {
      setDeleteLoading(true);
      await api.delete(`/projects/${id}`);
      navigate("/products", { replace: true });
    } catch (err) {
      setError("Failed to delete project");
      setDeleteLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return <FiCheckCircle className="text-green-500" />;
      case "pending":
        return <FiClock className="text-yellow-500" />;
      case "completed":
        return <FiCheckCircle className="text-blue-500" />;
      case "on hold":
        return <FiPauseCircle className="text-red-500" />;
      default:
        return <FiTag className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "on hold":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FiLoader className="animate-spin text-blue-600 mx-auto text-3xl mb-4" />
          <p className="text-gray-600">Loading project details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 pb-32">
        <div className="max-w-md w-full text-center">
          <FiAlertCircle className="text-red-500 text-4xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {error || "Project not found"}
          </h2>
          <p className="text-gray-600 mb-6">
            The project you're looking for doesn't exist or failed to load.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
          >
            <FiArrowLeft /> Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="max-w-4xl mx-auto">
        {/* Header with Back Button */}
        <div className="mb-6">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
          >
            <FiArrowLeft /> Back to Projects
          </Link>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FiBox className="text-blue-600 text-3xl" />
              <h1 className="text-3xl font-bold text-gray-800">
                {product.name}
              </h1>
            </div>
            {
              user.role==="admin" && (<div className="flex items-center gap-2">
              <Link
                to={`/create-product/${id}`}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <FiEdit /> Edit
              </Link>
              
              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-60"
              >
                <FiTrash2 />
                {deleteLoading ? "Deleting..." : "Delete"}
              </button>
            </div>)
            }
            
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Project Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description Card */}
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center gap-2 mb-4">
                <FiFileText className="text-gray-500" />
                <h2 className="text-lg font-semibold text-gray-800">Description</h2>
              </div>
              <p className="text-gray-600 whitespace-pre-line">
                {product.description || "No description provided."}
              </p>
            </div>

            {/* Additional Information Card */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Project Information
              </h2>
              
              <div className="space-y-4">
                {/* Status */}
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Status</span>
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${getStatusColor(product.status)}`}>
                    {getStatusIcon(product.status)}
                    <span className="capitalize">{product.status}</span>
                  </div>
                </div>

                {/* Deadline */}
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Deadline</span>
                  <div className="flex items-center gap-2 text-gray-800">
                    <FiCalendar />
                    {formatDate(product.deadline)}
                  </div>
                </div>

                {/* Created At */}
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Created</span>
                  <div className="text-gray-800">
                    {formatDate(product.createdAt || product.created_at)}
                  </div>
                </div>

                {/* Updated At */}
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Last Updated</span>
                  <div className="text-gray-800">
                    {formatDate(product.updatedAt || product.updated_at)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Actions & Notes */}
          <div className="space-y-6">
            {/* Project ID Card */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Project ID
              </h2>
              <div className="flex items-center gap-2">
                <FiTag className="text-gray-500" />
                <code className="bg-gray-100 px-3 py-1 rounded text-sm font-mono text-gray-800">
                  {id}
                </code>
              </div>
            </div>

          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mt-6 flex items-center gap-2 p-4 text-red-600 bg-red-50 border border-red-200 rounded-lg">
            <FiAlertCircle />
            {error}
          </div>
        )}
      </div>
    </div>
  );
}