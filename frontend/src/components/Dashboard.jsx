 

import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

// --- SVG Icons (same as your original icons) ---
const MattyLogo = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" rx="8" fill="#6366F1" />
    <path d="M9 23V9H13.6L16 16.2L18.4 9H23V23H19.8V13.8L17.2 23H14.8L12.2 13.8V23H9Z" fill="white" />
  </svg>
);

const EditorIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-indigo-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" />
  </svg>
);

const TemplateIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-indigo-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);

const DeleteIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

export default function Dashboard() {
  const { utahUser, setAuthUser, designs, deleteDesign } = useAuth();  // ✅ hook inside component
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("chat-user");
    // optionally keep designs; remove if you want to clear local cache
    // localStorage.removeItem('user-designs');
    setAuthUser(null);
    toast.success("Logged out successfully!");
    navigate("/");
  };
36
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this design? This action cannot be undone.")) return;

    try {
      const token = JSON.parse(localStorage.getItem("chat-user") || "{}").token;
      if (!token) {
        toast.error("Not authorized, please login again.");
        return;
      }

      const res = await fetch(`http://localhost:5000/api/designs/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.msg || "Failed to delete design");
      }

      deleteDesign(id);
      toast.success("Design deleted!");
    } catch (err) {
      toast.error(err.message || "Delete failed");
    }
  };

  

  const UserProfile = () => {
    const user = authUser?.user;
    const profileImageUrl = user?.profileImage ? `http://localhost:5000/${user.profileImage.replace(/\\/g, "/")}` : user?.googleProfileImage || null;

    return (
      <div className="flex items-center space-x-4">
        <div className="relative">
          {profileImageUrl ? (
            <img
              src={profileImageUrl}
              alt="Profile"
              className="w-12 h-12 rounded-full object-cover bg-gray-200"
              onError={(e) => {
                e.target.style.display = "none";
                if (e.target.nextSibling) e.target.nextSibling.style.display = "flex";
              }}
            />
          ) : null}
          <div className={`w-12 h-12 rounded-full bg-indigo-200 flex items-center justify-center ${profileImageUrl ? "hidden" : "flex"}`}>
            <span className="text-xl font-bold text-indigo-600">{user?.username?.charAt(0)?.toUpperCase()}</span>
          </div>
        </div>
        <div>
          <h2 className="font-semibold text-lg text-gray-800">{user?.username || "user"}</h2>
          <p className="text-sm text-gray-500">{user?.email}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* ✅ Logo now clickable */}
          <div
            onClick={() => navigate("/")}
            className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition"
          >
            <MattyLogo />
            <span className="text-2xl font-bold text-gray-800">MATTY</span>
          </div>

          <div className="flex items-center space-x-4">
            <UserProfile />
            <button
              onClick={handleLogout}
              className="bg-indigo-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>


      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Welcome , {authUser?.user?.username || "User"}!</h1>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div onClick={() => navigate("/editor")} className="bg-white p-8 rounded-xl shadow-md cursor-pointer hover:shadow-xl transition-shadow flex flex-col items-center text-center">
            <EditorIcon />
            <h3 className="text-xl font-bold text-gray-900">Create New Design</h3>
            <p className="text-gray-500 mt-2">Start from a blank canvas.</p>
          </div>

          <div onClick={() => navigate("/templates")} className="bg-white p-8 rounded-xl shadow-md cursor-pointer hover:shadow-xl transition-shadow flex flex-col items-center text-center">
            <TemplateIcon />
            <h3 className="text-xl font-bold text-gray-900">Browse Templates</h3>
            <p className="text-gray-500 mt-2">Choose from our library of professional templates.</p>
          </div>
        </div>

        {/* Recent Designs */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Recent Designs</h2>
          {designs && designs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {designs.map((design) => (
                <div key={design._id} className="bg-white rounded-lg shadow-md overflow-hidden group">
                  <img src={design.s3Url} alt={design.title} className="w-full h-48 object-cover bg-gray-200" />
                  <div className="p-5 flex items-center justify-between">
                    <h4 className="font-bold text-gray-800 truncate" title={design.title}>
                      {design.title}
                    </h4>
                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => navigate(`/editor/${design._id}`)} title="Edit Design" className="text-gray-500 hover:text-indigo-600 p-2 rounded-full hover:bg-gray-100">
                        <EditIcon />
                      </button>
                      <button onClick={() => handleDelete(design._id)} title="Delete Design" className="text-gray-500 hover:text-red-600 p-2 rounded-full hover:bg-gray-100">
                        <DeleteIcon />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <p className="text-gray-500">You haven't created any designs yet.</p>
              <button onClick={() => navigate("/editor")} className="mt-4 bg-indigo-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-indigo-700 transition-colors">
                Create your first design
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
