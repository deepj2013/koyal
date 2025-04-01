import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useCreateUserMutation } from "../redux/services/adminService/adminApi";
import { AuthState } from "../redux/features/authSlice";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

interface UserFormData {
  name: string;
  email: string;
  password: string;
}

const initialFormState = {
  name: "",
  email: "",
  password: "",
};

const CreateUser: React.FC = () => {
  const { adminInfo } = useSelector(AuthState);

  const [createUser, { isLoading, isError, error, isSuccess, reset }] =
    useCreateUserMutation();

  const [formData, setFormData] = useState<UserFormData>(initialFormState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    createUser({ data: formData, token: adminInfo?.token }).unwrap();
  };

  useEffect(() => {
    if (isSuccess) {
      setFormData(initialFormState);
      toast.success("User created successfully! 🎉");
      reset();
    }
  }, [isSuccess, isError]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="max-w-md mx-auto bg-white p-6 mt-10 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Create User</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          />

          {error && (
            <p className="text-red-500 text-sm mb-2">
              {(error as any).data?.error?.message}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "Creating..." : "Create User"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateUser;
