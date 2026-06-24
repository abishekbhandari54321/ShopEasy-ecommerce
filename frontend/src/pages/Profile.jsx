import { useEffect, useState } from "react";
import { authFetch, isLoggedIn } from "../utils/auth";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();

  const [data, setData] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({});

  // 🔐 PROTECT ROUTE
  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/login");
      return;
    }

    authFetch("/profile/")
      .then((res) => {
        if (!res) throw new Error();
        return res.json();
      })
      .then((resData) => setData(resData))
      .catch(() => {
        alert("Session expired");
        navigate("/login");
      });
  }, []);

  // ✅ VALIDATION
  const validate = () => {
    let newErrors = {};

    if (data.phone && !/^[6-9]\d{9}$/.test(data.phone)) {
      newErrors.phone = "Enter valid 10-digit number";
    }

    if (data.address && data.address.length < 5) {
      newErrors.address = "Address too short";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // ✅ UPDATE PROFILE
  const updateProfile = async () => {
    if (!validate()) return;

    setLoading(true);

    try {
      const res = await authFetch("/profile/", {
        method: "PUT", // 🔥 IMPORTANT (not POST)
        body: JSON.stringify({
          phone: data.phone,
          address: data.address,
        }),
      });

      if (!res) throw new Error();

      alert("✅ Profile updated successfully");
      setEditMode(false);
    } catch {
      alert("❌ Update failed");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start p-6">
      <div className="bg-white w-full max-w-xl p-6 rounded-2xl shadow-lg">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">My Profile</h2>

          {!editMode ? (
            <button
              onClick={() => setEditMode(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Edit
            </button>
          ) : (
            <button
              onClick={() => setEditMode(false)}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          )}
        </div>

        {/* USER INFO */}
        <div className="space-y-4">
          {/* NAME */}
          <div>
            <label className="text-sm text-gray-500">Name</label>
            <input
              value={data.username || ""}
              disabled
              className="w-full border p-2 rounded bg-gray-100"
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="text-sm text-gray-500">Email</label>
            <input
              value={data.email || ""}
              disabled
              className="w-full border p-2 rounded bg-gray-100"
            />
          </div>

          {/* PHONE */}
          <div>
            <label className="text-sm text-gray-500">
              Phone
              {editMode && <span className="text-red-500"> *</span>}
            </label>

            <div className="flex border rounded overflow-hidden">
              <span className="px-3 bg-gray-100">🇮🇳 +91</span>
              <input
                disabled={!editMode}
                value={data.phone || ""}
                onChange={(e) => setData({ ...data, phone: e.target.value })}
                className="w-full p-2 outline-none"
              />
            </div>

            {errors.phone && (
              <p className="text-red-500 text-sm">{errors.phone}</p>
            )}
          </div>

          {/* ADDRESS */}
          <div>
            <label className="text-sm text-gray-500">
              Address
              {editMode && <span className="text-red-500"> *</span>}
            </label>

            <textarea
              disabled={!editMode}
              value={data.address || ""}
              onChange={(e) => setData({ ...data, address: e.target.value })}
              className="w-full border p-2 rounded"
            />

            {errors.address && (
              <p className="text-red-500 text-sm">{errors.address}</p>
            )}
          </div>
        </div>

        {/* ACTION BUTTONS */}
        {editMode && (
          <button
            onClick={updateProfile}
            disabled={loading}
            className="mt-6 w-full bg-green-600 text-white py-3 rounded-lg"
          >
            {loading ? "Updating..." : "Save Changes"}
          </button>
        )}

        <button
          onClick={() => navigate("/")}
          className="mt-4 w-full text-gray-600 underline"
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
};

export default Profile;
