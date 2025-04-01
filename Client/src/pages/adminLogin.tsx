import React, { useEffect, useState } from "react";
import { useAdminLoginMutation } from "../redux/services/adminService/adminApi";
import { setAdminInfo } from "../redux/features/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PageRoutes } from "../routes/appRoutes";

const AdminLogin: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userId: "",
    password: "",
  });

  const [adminLogin, { data: adminLoginData, isLoading, error, reset }] =
    useAdminLoginMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminLogin(formData).unwrap();
    } catch (err) {
      console.error("Login failed", err);
    }
  };

  useEffect(() => {
    if (adminLoginData?.success) {
      dispatch(setAdminInfo({ ...adminLoginData?.result }));
      navigate(PageRoutes.CREATE_USER);
      reset();
    }
  }, [adminLoginData]);

  return (
    <div className="flex justify-center items-center h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 shadow-md rounded-lg w-80"
      >
        <h2 className="text-xl font-semibold mb-4">Admin Login</h2>

        <div className="mb-4">
          <label className="block text-gray-700">User ID</label>
          <input
            type="text"
            name="userId"
            value={formData.userId}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            required
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm mb-2">
            {(error as any).data?.error?.message}
          </p>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
