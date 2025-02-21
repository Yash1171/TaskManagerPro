import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Box, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { login } from '../service/api';

function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await login(formData);
            if (response.data && response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('userId', response.data.userId);
                toast.success('Login successful!');
                navigate('/dashboard');
            } else {
                throw new Error('Invalid response from server');
            }
        } catch (error) {
            console.error('Login Error:', error);
            toast.error(error.response?.data?.message || 'Failed to login. Please check your credentials.');
        }
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            display: 'flex',
            position: 'relative',
            backgroundColor: '#f3f4f6',
            backgroundImage: `
                radial-gradient(at 90% 10%, #e0f2fe 0px, transparent 50%),
                radial-gradient(at 10% 90%, #dbeafe 0px, transparent 50%),
                radial-gradient(at 50% 50%, #eff6ff 0px, transparent 50%)
            `,
        }}>
            {/* Left Section */}
            <Box sx={{
                flex: '1',
                display: { xs: 'none', md: 'flex' },
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                p: 8,
                background: 'linear-gradient(45deg, #3b82f6 30%, #2563eb 90%)',
                color: 'white',
                position: 'relative',
                overflow: 'hidden',
            }}>
                <Box sx={{
                    position: 'relative',
                    zIndex: 2,
                    textAlign: 'center'
                }}>
                    <Typography variant="h3" sx={{ 
                        fontWeight: 700,
                        mb: 3,
                        letterSpacing: '-0.5px'
                    }}>
                        Task Manager Pro
                    </Typography>
                    <Typography variant="h6" sx={{ 
                        maxWidth: '400px',
                        lineHeight: 1.6,
                        opacity: 0.9
                    }}>
                        Streamline your workflow and boost productivity with our intuitive task management system.
                    </Typography>
                </Box>
                
                {/* Decorative Elements */}
                <Box sx={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    opacity: 0.1,
                    background: `
                        linear-gradient(45deg, transparent 45%, #ffffff 45%, #ffffff 55%, transparent 55%),
                        linear-gradient(-45deg, transparent 45%, #ffffff 45%, #ffffff 55%, transparent 55%)
                    `,
                    backgroundSize: '30px 30px'
                }}/>
            </Box>

            {/* Right Section - Login Form */}
            <Box sx={{
                flex: { xs: '1', md: '0.8' },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                p: { xs: 2, sm: 4, md: 8 },
            }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{ width: '100%', maxWidth: '400px' }}
                >
                    <Paper elevation={0} sx={{
                        p: 4,
                        borderRadius: 3,
                        backgroundColor: 'white',
                        border: '1px solid rgba(0,0,0,0.1)',
                    }}>
                        <Box sx={{ mb: 4, textAlign: 'center' }}>
                            <Typography variant="h4" sx={{ 
                                fontWeight: 700,
                                color: '#1e3a8a',
                                mb: 1
                            }}>
                                Welcome Back
                            </Typography>
                            <Typography variant="body1" sx={{ color: '#64748b' }}>
                                Please sign in to continue
                            </Typography>
                        </Box>

                        <Box component="form" onSubmit={handleSubmit} sx={{ space: 'y-4' }}>
                            <Box sx={{ mb: 3 }}>
                                <Typography sx={{
                                    mb: 1.5,
                                    color: '#1e293b',
                                    fontWeight: 500,
                                    fontSize: '0.875rem'
                                }}>
                                    Email Address
                                </Typography>
                                <TextField
                                    fullWidth
                                    required
                                    type="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            backgroundColor: '#f8fafc',
                                            borderRadius: 2,
                                            '&:hover fieldset': {
                                                borderColor: '#3b82f6',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#3b82f6',
                                                borderWidth: '1px',
                                            }
                                        }
                                    }}
                                />
                            </Box>

                            <Box sx={{ mb: 4 }}>
                                <Typography sx={{
                                    mb: 1.5,
                                    color: '#1e293b',
                                    fontWeight: 500,
                                    fontSize: '0.875rem'
                                }}>
                                    Password
                                </Typography>
                                <TextField
                                    fullWidth
                                    required
                                    type="password"
                                    name="password"
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            backgroundColor: '#f8fafc',
                                            borderRadius: 2,
                                            '&:hover fieldset': {
                                                borderColor: '#3b82f6',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#3b82f6',
                                                borderWidth: '1px',
                                            }
                                        }
                                    }}
                                />
                            </Box>

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{
                                    mt: 2,
                                    mb: 3,
                                    py: 1.5,
                                    backgroundColor: '#3b82f6',
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.2)',
                                    '&:hover': {
                                        backgroundColor: '#2563eb',
                                        boxShadow: '0 6px 8px -1px rgba(59, 130, 246, 0.3)',
                                    }
                                }}
                            >
                                Sign In
                            </Button>

                            <Box sx={{ textAlign: 'center' }}>
                                <Button
                                    onClick={() => navigate('/register')}
                                    sx={{
                                        color: '#3b82f6',
                                        textTransform: 'none',
                                        fontWeight: 500,
                                        '&:hover': {
                                            backgroundColor: 'rgba(59, 130, 246, 0.05)',
                                        }
                                    }}
                                >
                                    Don't have an account? Sign Up
                                </Button>
                            </Box>
                        </Box>
                    </Paper>

                    <Box sx={{ 
                        mt: 3,
                        textAlign: 'center',
                        color: '#64748b',
                        fontSize: '0.875rem'
                    }}>
                        &copy; Made by Yash Soni
                    </Box>
                </motion.div>
            </Box>
        </Box>
    );
}

export default Login;