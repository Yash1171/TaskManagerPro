import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Container, 
    Grid, 
    Paper, 
    Button, 
    Typography, 
    Box,
    
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { motion } from 'framer-motion';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import ChatBot from '../components/ChatBot';
import Header from '../components/Header';
import TaskSuggestions from '../components/TaskSuggestions';
import { getTasks } from '../service/api';
import { initializeWebSocket, closeWebSocket, subscribeToUpdates } from '../service/websocket';
import { getTaskSuggestions } from '../service/gemini';
import toast from 'react-hot-toast';

function TaskDashboard() {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [formData, setFormData] = useState({ title: '', description: '' });

    const fetchTasks = useCallback(async () => {
        try {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                toast.error('Please login again');
                navigate('/login');
                return;
            }
            const response = await getTasks();
            setTasks(response || []);
        } catch (error) {
            console.error('Fetch tasks error:', error);
            toast.error('Failed to fetch tasks');
            setTasks([]);
        }
    }, [navigate]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        
        if (!token || !userId) {
            navigate('/login');
            return;
        }

        fetchTasks();
        initializeWebSocket();
        
        const unsubscribe = subscribeToUpdates((data) => {
            if (data.type === 'TASK_UPDATE' && data.userId === userId) {
                fetchTasks();
            }
        });

        return () => {
            unsubscribe();
            closeWebSocket();
        };
    }, [fetchTasks, navigate]);

    const updateSuggestions = useCallback(async () => {
        try {
            const suggestionsText = await getTaskSuggestions(tasks);
            const extractedSuggestions = suggestionsText
                .split('Suggested Task:')
                .slice(1)
                .map(suggestion => suggestion.split('\n')[0].trim());
            setSuggestions(extractedSuggestions);
        } catch (error) {
            console.error('Failed to get suggestions:', error);
            setSuggestions([]);
        }
    }, [tasks]);

    useEffect(() => {
        if (tasks.length > 0) {
            updateSuggestions();
        }
    }, [tasks.length, updateSuggestions]);

    const handleSuggestionClick = (suggestion) => {
        setIsFormOpen(true);
        setFormData({ title: suggestion, description: '' });
    };

    return (
        <Box sx={{ 
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f0f7ff 0%, #e6e9ff 100%)'
        }}>
            <Header />
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <motion.div>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Paper
                                elevation={3}
                                sx={{
                                    position: 'relative',
                                    overflow: 'hidden',
                                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                                    borderRadius: 4,
                                    p: 4,
                                    color: 'white',
                                    '&::before': {
                                        content: '""',
                                        position: 'absolute',
                                        top: -100,
                                        right: -100,
                                        width: 200,
                                        height: 200,
                                        borderRadius: '50%',
                                        background: 'rgba(255, 255, 255, 0.1)',
                                    },
                                    '&::after': {
                                        content: '""',
                                        position: 'absolute',
                                        bottom: -80,
                                        left: -80,
                                        width: 160,
                                        height: 160,
                                        borderRadius: '50%',
                                        background: 'rgba(255, 255, 255, 0.1)',
                                    }
                                }}
                            >
                                <Box sx={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    position: 'relative',
                                    zIndex: 1
                                }}>
                                    <Box>
                                        <Typography
                                            variant="h3"
                                            sx={{
                                                fontWeight: 700,
                                                mb: 1,
                                                textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
                                            }}
                                        >
                                            Task Dashboard
                                        </Typography>
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                color: 'rgba(255,255,255,0.9)',
                                                fontWeight: 400
                                            }}
                                        >
                                            Manage your tasks efficiently
                                        </Typography>
                                    </Box>
                                    <Button
                                        variant="contained"
                                        onClick={() => setIsFormOpen(true)}
                                        sx={{
                                            bgcolor: 'white',
                                            color: 'white',
                                            px: 3,
                                            py: 1.5,
                                            fontSize: '1rem',
                                            fontWeight: 600,
                                            '&:hover': {
                                                bgcolor: 'rgba(255,255,255,0.9)',
                                                transform: 'translateY(-2px)',
                                            },
                                            transition: 'all 0.2s ease-in-out',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                        }}
                                        startIcon={<AddIcon />}
                                    >
                                        Add New Task
                                    </Button>
                                </Box>
                            </Paper>
                        </Grid>

                        <Grid item xs={12}>
                            <Paper
                                elevation={2}
                                sx={{
                                    p: 3,
                                    borderRadius: 2,
                                    bgcolor: 'white',
                                    transition: 'box-shadow 0.3s ease',
                                    '&:hover': {
                                        boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
                                    }
                                }}
                            >
                                <TaskList tasks={tasks} onTaskUpdate={fetchTasks} />
                            </Paper>
                        </Grid>

                        <Grid item xs={12}>
                            <Paper
                                elevation={2}
                                sx={{
                                    p: 3,
                                    borderRadius: 2,
                                    background: 'linear-gradient(135deg, #faf5ff 0%, #f5f3ff 100%)',
                                    transition: 'box-shadow 0.3s ease',
                                    '&:hover': {
                                        boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
                                    }
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
                                    <AutoAwesomeIcon sx={{ color: '#9333ea' }} />
                                    <Typography variant="h5" sx={{ color: '#6b21a8', fontWeight: 600 }}>
                                        AI Suggestions
                                    </Typography>
                                </Box>
                                <TaskSuggestions
                                    suggestions={suggestions}
                                    onSuggestionClick={handleSuggestionClick}
                                />
                            </Paper>
                        </Grid>
                    </Grid>
                </motion.div>

                <TaskForm
                    open={isFormOpen}
                    onClose={() => setIsFormOpen(false)}
                    onTaskAdded={fetchTasks}
                    initialData={formData}
                />
            </Container>
            <ChatBot onSuggestionSelect={handleSuggestionClick} />
        </Box>
    );
}

export default TaskDashboard;