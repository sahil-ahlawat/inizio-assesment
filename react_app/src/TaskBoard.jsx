
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TaskBoard = () => {
    const [categories, setCategories] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [error, setError] = useState(null);
    const [draggedTask, setDraggedTask] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('Authentication token not found.');
                    return;
                }

                const categoriesResponse = await axios.get('http://localhost:8000/api/categories', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCategories(categoriesResponse.data);

                const tasksResponse = await axios.get('http://localhost:8000/api/tasks', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setTasks(tasksResponse.data.data);

            } catch (err) {
                setError('Failed to fetch data. Please try again later.');
                console.error(err);
            }
        };

        fetchData();
    }, []);

    const handleDragStart = (e, task) => {
        setDraggedTask(task);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = async (e, categoryId) => {
        e.preventDefault();
        if (!draggedTask) return;

        const originalCategoryId = draggedTask.category_id;
        if (originalCategoryId === categoryId) {
            // Handle reordering within the same category
            const updatedTasks = [...tasks];
            const taskIndex = updatedTasks.findIndex(t => t.id === draggedTask.id);
            const dropIndex = Array.from(e.currentTarget.children).findIndex(el => el === e.target);

            if (taskIndex !== -1 && dropIndex !== -1) {
                console.log(`Order of task (${draggedTask.id}) changed from ${taskIndex} to ${dropIndex}`);
            }
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:8000/api/tasks/${draggedTask.id}`,
                { ...draggedTask, category_id: categoryId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setTasks(tasks.map(t => t.id === draggedTask.id ? { ...t, category_id: categoryId } : t));
        } catch (err) {
            setError('Failed to update task category.');
            console.error(err);
        } finally {
            setDraggedTask(null);
        }
    };

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="task-board">
            {categories.map(category => (
                <div
                    key={category.id}
                    className="category-column"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, category.id)}
                >
                    <h2>{category.title}</h2>
                    {tasks
                        .filter(task => task.category_id === category.id)
                        .map(task => (
                            <div
                                key={task.id}
                                className="task-card"
                                draggable
                                onDragStart={(e) => handleDragStart(e, task)}
                            >
                                {task.title}
                            </div>
                        ))}
                </div>
            ))}
        </div>
    );
};

export default TaskBoard;
