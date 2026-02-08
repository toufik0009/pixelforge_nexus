import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import {
  FiBox,
  FiFileText,
  FiCalendar,
  FiSave,
  FiAlertCircle
} from "react-icons/fi";

export default function CreateProduct() {
  const { id } = useParams(); // Extract ID from URL
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [status, setStatus] = useState("active");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false); // Add edit mode state

  const navigate = useNavigate();

  // Fetch product data if ID exists (edit mode)
  useEffect(() => {
    if (id) {
      setIsEditing(true);
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/projects/${id}`);
      const product = response.data;
      
      setName(product.name || "");
      setDescription(product.description || "");
      setDeadline(product.deadline ? product.deadline.split('T')[0] : "");
      setStatus(product.status || "active");
    } catch (err) {
      setError("Failed to load project");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isEditing) {
        // Update existing product
        await api.put(`/projects/${id}`, {
          name,
          description,
          deadline,
          status
        });
      } else {
        // Create new product
        await api.post("/projects", {
          name,
          description,
          deadline,
          status
        });
      }

      navigate("/products", { replace: true });
    } catch (err) {
      setError(`Failed to ${isEditing ? "update" : "create"} project`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 pb-32">
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-lg p-6">

        {/* Header - Updated to show Edit/Create based on mode */}
        <div className="flex items-center gap-3 mb-6">
          <FiBox className="text-blue-600" size={26} />
          <h1 className="text-2xl font-bold text-gray-800">
            {isEditing ? "Edit Project" : "Create Project"}
          </h1>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 mb-4 text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            <FiAlertCircle />
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Project Name
            </label>
            <div className="relative">
              <FiBox className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Enter project name"
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={loading && isEditing}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Description
            </label>
            <div className="relative">
              <FiFileText className="absolute left-3 top-3 text-gray-400" />
              <textarea
                placeholder="Project description"
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                disabled={loading && isEditing}
              />
            </div>
          </div>

          {/* Deadline */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Deadline
            </label>
            <div className="relative">
              <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                disabled={loading && isEditing}
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Status
            </label>
            <select
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              disabled={loading && isEditing}
            >
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="on hold">On Hold</option>
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
          >
            <FiSave />
            {loading ? (
              isEditing ? "Updating..." : "Creating..."
            ) : (
              isEditing ? "Update Project" : "Create Project"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}