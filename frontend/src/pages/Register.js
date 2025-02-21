import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { register } from '../service/api';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(formData);
            toast.success('Registration successful! Please login.');
            navigate('/login');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen flex bg-[#f0f5ff]">
            {/* Left section with pattern */}
            <div className="hidden lg:block lg:w-1/2 relative bg-[#4070f4]">
                {/* Background pattern */}
                <div className="absolute inset-0" style={{
                    backgroundImage: `repeating-linear-gradient(45deg, rgba(255,255,255,0.1) 0px, rgba(255,255,255,0.1) 2px, transparent 2px, transparent 20px),
                                    repeating-linear-gradient(-45deg, rgba(255,255,255,0.1) 0px, rgba(255,255,255,0.1) 2px, transparent 2px, transparent 20px)`,
                    backgroundSize: '28px 28px'
                }}/>
                
                {/* Content */}
                <div className="relative h-full flex flex-col items-center justify-center text-center px-8">
                    <h1 className="text-5xl font-bold text-white mb-6">Task Manager Pro</h1>
                    <p className="text-lg text-white/90 max-w-lg">
                        Streamline your workflow and boost productivity with our intuitive task management system.
                    </p>
                </div>
            </div>

            {/* Right section */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md"
                >
                    <div className="bg-white rounded-3xl shadow-xl p-8">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-[#4070f4] mb-3">Create Account</h2>
                            <p className="text-gray-600">Please fill in your details to continue</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-2">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Enter your full name"
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4070f4] focus:border-transparent transition-all"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    required
                                    placeholder="Enter your email"
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4070f4] focus:border-transparent transition-all"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-2">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    required
                                    placeholder="Create a password"
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4070f4] focus:border-transparent transition-all"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-[#4070f4] text-white py-3 rounded-xl font-semibold hover:bg-blue-600 transition-colors duration-200 mt-8"
                            >
                                Sign Up
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <button
                                onClick={() => navigate('/login')}
                                className="text-[#4070f4] hover:text-blue-600 font-medium"
                            >
                                Already have an account? Sign In
                            </button>
                        </div>

                        <div className="mt-8 pt-6 text-center text-sm text-gray-500 border-t">
                            © Made by Yash Soni
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Register;