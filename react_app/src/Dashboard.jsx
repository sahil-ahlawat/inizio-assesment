import React, { useState, useEffect, useCallback } from 'react';
import TaskBoard from './TaskBoard';

const LoadingSpinner = () => (
  <div className="loading-spinner-overlay">
    <div className="loading-spinner"></div>
  </div>
);

const Dashboard = ({ token, handleLogout }) => {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newCategoryTitle, setNewCategoryTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/tasks?per_page=100`, { // Fetch all tasks
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });
      const data = await response.json();
      setTasks(data.data);
    } catch (error) {
      setError('Error fetching tasks');
    } finally {
      setIsLoading(false);
    }
  }, [token, API_URL]);

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/categories`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      setError('Error fetching categories');
    } finally {
      setIsLoading(false);
    }
  }, [token, API_URL]);

  useEffect(() => {
    fetchTasks();
    fetchCategories();
  }, [fetchTasks, fetchCategories]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    const newTask = { id: Date.now(), title: newTaskTitle, category: [{ id: selectedCategory, title: '' }] };
    setTasks(prev => [...prev, newTask]);
    setIsLoading(true);
    try {
      await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ title: newTaskTitle, category_id: selectedCategory }),
      });
      setNewTaskTitle('');
      fetchTasks();
    } catch (error) {
      setError('Error creating task');
      setTasks(tasks.filter(t => t.id !== newTask.id));
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    const originalTasks = [...tasks];
    const updatedTask = { ...editingTask, title: editingTask.title, category: [{ id: editingTask.category[0].id }] };
    setTasks(tasks.map(t => t.id === editingTask.id ? updatedTask : t));
    setEditingTask(null);
    setIsLoading(true);
    try {
      await fetch(`${API_URL}/tasks/${editingTask.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ title: editingTask.title, category_id: editingTask.category[0].id }),
      });
    } catch (error) {
      setError('Error updating task');
      setTasks(originalTasks);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTask = async (id) => {
    const originalTasks = [...tasks];
    setTasks(tasks.filter(t => t.id !== id));
    setIsLoading(true);
    try {
      await fetch(`${API_URL}/tasks/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
    } catch (error) {
      setError('Error deleting task');
      setTasks(originalTasks);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    const newCategory = { id: Date.now(), title: newCategoryTitle };
    setCategories(prev => [...prev, newCategory]);
    setIsLoading(true);
    try {
      await fetch(`${API_URL}/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ title: newCategoryTitle }),
      });
      setNewCategoryTitle('');
      fetchCategories();
    } catch (error) {
      setError('Error creating category');
      setCategories(categories.filter(c => c.id !== newCategory.id));
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    const originalCategories = [...categories];
    const updatedCategory = { ...editingCategory, title: editingCategory.title };
    setCategories(categories.map(c => c.id === editingCategory.id ? updatedCategory : c));
    setEditingCategory(null);
    setIsLoading(true);
    try {
      await fetch(`${API_URL}/categories/${editingCategory.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ title: editingCategory.title }),
      });
    } catch (error) {
      setError('Error updating category');
      setCategories(originalCategories);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    const originalCategories = [...categories];
    setCategories(categories.filter(c => c.id !== id));
    setIsLoading(true);
    try {
      await fetch(`${API_URL}/categories/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
    } catch (error) {
      setError('Error deleting category');
      setCategories(originalCategories);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTaskCategoryUpdate = async (taskId, taskTitle, newCategoryId) => {
    const originalTasks = [...tasks];
    const updatedTasks = tasks.map(t => t.id === taskId ? { ...t, category: [{ id: newCategoryId }] } : t);
    setTasks(updatedTasks);
    setIsLoading(true);
    try {
      await fetch(`${API_URL}/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ title: taskTitle, category_id: newCategoryId }),
      });
    } catch (error) {
      setError('Error updating task category');
      setTasks(originalTasks);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '20px' }}>
      {isLoading && <LoadingSpinner />}
      {error && <div style={{ color: 'red', textAlign: 'center', marginBottom: '10px' }}>{error}</div>}
      <div style={{ textAlign: 'right', marginBottom: '20px' }}>
        <button onClick={handleLogout} style={{ backgroundColor: '#dc3545', color: '#fff', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Logout
        </button>
      </div>

      <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', marginBottom: '24px', textAlign: 'center' }}>Task Management</h1>

      {/* Task & Category Forms */}
      <div style={{ display: 'flex', gap: '32px', marginBottom: '32px' }}>
        {/* Task Form */}
        <div style={{ flex: 1, backgroundColor: '#fff', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', borderRadius: '8px', padding: '24px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'semibold', marginBottom: '16px' }}>{editingTask ? 'Edit Task' : 'Add Task'}</h2>
          <form onSubmit={editingTask ? handleUpdateTask : handleCreateTask}>
            <input
              type="text"
              placeholder="Task Title"
              value={editingTask ? editingTask.title : newTaskTitle}
              onChange={(e) => editingTask ? setEditingTask({ ...editingTask, title: e.target.value }) : setNewTaskTitle(e.target.value)}
              style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', marginBottom: '16px' }}
            />
            <select
              value={editingTask ? editingTask.category[0].id : selectedCategory}
              onChange={(e) => editingTask ? setEditingTask({ ...editingTask, category: [{ id: e.target.value }] }) : setSelectedCategory(e.target.value)}
              style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', marginBottom: '16px' }}
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.title}
                </option>
              ))}
            </select>
            <button type="submit" style={{ backgroundColor: '#007bff', color: '#fff', padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              {editingTask ? 'Update Task' : 'Add Task'}
            </button>
            {editingTask && (
              <button onClick={() => setEditingTask(null)} style={{ backgroundColor: '#6c757d', color: '#fff', padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer', marginLeft: '8px' }}>
                Cancel
              </button>
            )}
          </form>
        </div>

        {/* Category Form */}
        <div style={{ flex: 1, backgroundColor: '#fff', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', borderRadius: '8px', padding: '24px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'semibold', marginBottom: '16px' }}>{editingCategory ? 'Edit Category' : 'Add Category'}</h2>
          <form onSubmit={editingCategory ? handleUpdateCategory : handleCreateCategory}>
            <input
              type="text"
              placeholder="Category Title"
              value={editingCategory ? editingCategory.title : newCategoryTitle}
              onChange={(e) => editingCategory ? setEditingCategory({ ...editingCategory, title: e.target.value }) : setNewCategoryTitle(e.target.value)}
              style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', marginBottom: '16px' }}
            />
            <button type="submit" style={{ backgroundColor: '#007bff', color: '#fff', padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              {editingCategory ? 'Update Category' : 'Add Category'}
            </button>
            {editingCategory && (
              <button onClick={() => setEditingCategory(null)} style={{ backgroundColor: '#6c757d', color: '#fff', padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer', marginLeft: '8px' }}>
                Cancel
              </button>
            )}
          </form>

          <h3 style={{ fontSize: '1.25rem', fontWeight: 'semibold', marginTop: '24px', marginBottom: '16px' }}>Existing Categories</h3>
          <ul style={{ listStyle: 'none', padding: '0' }}>
            {categories.map((category) => (
              <li key={category.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8f8f8', padding: '12px', borderRadius: '6px', marginBottom: '8px' }}>
                <span>{category.title}</span>
                <div>
                  <button onClick={() => setEditingCategory(category)} style={{ backgroundColor: '#ffc107', color: '#fff', padding: '6px 12px', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '8px' }}>
                    Edit
                  </button>
                  <button onClick={() => handleDeleteCategory(category.id)} style={{ backgroundColor: '#dc3545', color: '#fff', padding: '6px 12px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="taskmanagementboard">
        <TaskBoard categories={categories} tasks={tasks} onTaskCategoryUpdate={handleTaskCategoryUpdate} />
      </div>
    </div>
  );
};

export default Dashboard;