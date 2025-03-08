import React from "react";
import homebg from "../assets/vedio/koyal_bg.mp4";
import logo from "../assets/images/Nav.svg";
import { useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

const Login = () => {
    const navigate = useNavigate();
    return (
        <div className="flex h-screen">
            {/* Left Section: Video */}
            <div className="w-1/2 relative">
                <video
                    className="w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                    src={homebg} // Replace with the correct video path
                >
                    Your browser does not support the video tag.
                </video>
            </div>

            {/* Right Section: Form */}
            <div className="w-1/2 bg-white flex flex-col justify-center p-20 relative pt-0">
                {/* Logo */}
                <div className="absolute top-[10%] left-20">
                    <img
                        src={logo} // Replace with the correct logo path
                        alt="Koyal Logo"
                        className="w-30 h-auto"
                    />
                </div>

                {/* Form */}
                <div className="w-[85%] xl:w-[75%] px-2">
                    <h1 className="text-[32px] font-medium leading-[24px] tracking-[0%] font-inter mb-4">
                        Get started
                    </h1>

                    {/* Updated Paragraph */}
                    <p className="text-gray-500 text-[16px] font-medium leading-[24px] tracking-[0%] font-inter mb-6">
                        Provide your name and email so we can send your video creation at the end
                    </p>


                    {/* Name Field */}
                    <div className="mb-4">
                        <label
                            htmlFor="name"
                            className="block text-[16px] font-medium leading-[24px] tracking-[0%] text-gray-700 font-inter mb-2"
                        >
                            Your name<span className="text-red-500">*</span>
                        </label>
                        <input
                            id="name"
                            type="text"
                            placeholder="Ex: John Doe"
                            className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                        />
                    </div>

                    {/* Updated Label for Email */}
                    <div className="mb-6">
                        <label
                            htmlFor="email"
                            className="block text-[16px] font-medium leading-[24px] tracking-[0%] text-gray-700 font-inter mb-2"
                        >
                            Provide email to receive final video
                            <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="email"
                            type="email"
                            placeholder="yourname@gmail.com"
                            className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        className="w-full px-6 py-3 bg-black text-white rounded-md font-semibold hover:bg-gray-800 flex items-center justify-center space-x-2"
                        onClick={() => navigate("/upload")}
                    >
                        <span>Start creating</span>
                        <FaArrowRight/>
                    </button>

                    {/* Instructions */}
                    <p className="text-gray-400 text-sm mt-4 text-center">
                        Click on the button to start your video creation process (motiontest)
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;