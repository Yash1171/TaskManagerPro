import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom'; // Add this import
import { Container, Grid, Paper, Button, Typography } from '@mui/material';
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
    const navigate = useNavigate(); // Add this hook
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

            console.log('Fetching tasks...'); // Debug log
            const response = await getTasks();
            console.log('Fetched tasks:', response); // Debug log
            
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
        
        // Initialize WebSocket
        initializeWebSocket();
        
        // Set up subscription
        const unsubscribe = subscribeToUpdates((data) => {
            if (data.type === 'TASK_UPDATE' && data.userId === userId) {
                fetchTasks();
            }
        });

        // Cleanup function
        return () => {
            unsubscribe();
            closeWebSocket();
        };
    }, [fetchTasks]);

    const updateSuggestions = useCallback(async () => {
        try {
            const suggestionsText = await getTaskSuggestions(tasks);
            const extractedSuggestions = suggestionsText
                .split('Suggested Task:')
                .slice(1)
                .map(suggestion => {
                    const lines = suggestion.split('\n');
                    return lines[0].trim();
                });
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
        // Pre-fill the form with the suggestion
        setFormData({ title: suggestion, description: '' });
    };

    return (
        <>
            <Header />
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Paper 
                                sx={{ 
                                    p: 3, 
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    alignItems: 'center',
                                    background: 'linear-gradient(45deg, #2563eb 30%, #60a5fa 90%)',
                                    color: 'white'
                                }}
                            >
                                <Typography variant="h4">Task Dashboard</Typography>
                                <Button
                                    variant="contained"
                                    onClick={() => setIsFormOpen(true)}
                                    sx={{
                                        bgcolor: 'white',
                                        color: 'primary.main',
                                        '&:hover': {
                                            bgcolor: 'rgba(255, 255, 255, 0.9)',
                                        }
                                    }}
                                >
                                    Add New Task
                                </Button>
                            </Paper>
                        </Grid>
                        <Grid item xs={12}>
                            <TaskList tasks={tasks} onTaskUpdate={fetchTasks} />
                        </Grid>
                        <Grid item xs={12}>
                            <TaskSuggestions 
                                suggestions={suggestions} 
                                onSuggestionClick={handleSuggestionClick} 
                            />
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
            <ChatBot onSuggestionSelect={(suggestion) => {
                setFormData({ title: suggestion, description: '' });
                setIsFormOpen(true);
            }} />
        </>
    );
}

export default TaskDashboard;