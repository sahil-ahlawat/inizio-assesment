import React, { useState, useEffect } from 'react';

const Dashboard = ({ token, handleLogout }) => {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newCategoryTitle, setNewCategoryTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const API_URL = import.meta.env.VITE_API_URL;

  const fetchTasks = async (page = 1) => {
    try {
      const categoryFilter = selectedCategory ? `&category_id=${selectedCategory}` : '';
      const response = await fetch(`${API_URL}/tasks?page=${page}${categoryFilter}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });
      const data = await response.json();
      setTasks(data.data);
      setCurrentPage(data.current_page);
      setLastPage(data.last_page);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const fetchCategories = async () => {
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
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchTasks(currentPage);
    fetchCategories();
  }, [token, currentPage, selectedCategory]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
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
      console.error('Error creating task:', error);
    }
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();
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
      setEditingTask(null);
      fetchTasks();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await fetch(`${API_URL}/tasks/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
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
      console.error('Error creating category:', error);
    }
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
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
      setEditingCategory(null);
      fetchCategories();
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await fetch(`${API_URL}/categories/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '20px' }}>
      <div style={{ textAlign: 'right', marginBottom: '20px' }}>
        <button onClick={handleLogout} style={{ backgroundColor: '#dc3545', color: '#fff', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Logout
        </button>
      </div>

      <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', marginBottom: '24px', textAlign: 'center' }}>Task Management</h1>

      {/* Task Management */}
      <div style={{ backgroundColor: '#fff', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', borderRadius: '8px', padding: '24px', marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'semibold', marginBottom: '16px' }}>Tasks</h2>
        <form onSubmit={editingTask ? handleUpdateTask : handleCreateTask} style={{ marginBottom: '16px', display: 'flex', gap: '8px' }}>
          <input
            type="text"
            placeholder="Task Title"
            value={editingTask ? editingTask.title : newTaskTitle}
            onChange={(e) => editingTask ? setEditingTask({ ...editingTask, title: e.target.value }) : setNewTaskTitle(e.target.value)}
            style={{ flex: '1', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
          <select
            value={editingTask ? editingTask.category[0].id : selectedCategory}
            onChange={(e) => editingTask ? setEditingTask({ ...editingTask, category: [{ id: e.target.value }] }) : setSelectedCategory(e.target.value)}
            style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
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
            <button onClick={() => setEditingTask(null)} style={{ backgroundColor: '#6c757d', color: '#fff', padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Cancel
            </button>
          )}
        </form>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Filter by Category:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.title}
              </option>
            ))}
          </select>
        </div>

        <ul style={{ listStyle: 'none', padding: '0' }}>
          {tasks.map((task) => (
            <li key={task.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8f8f8', padding: '12px', borderRadius: '6px', marginBottom: '8px' }}>
              <span>{task.title} ({task.category[0]?.title})</span>
              <div>
                <button onClick={() => setEditingTask(task)} style={{ backgroundColor: '#ffc107', color: '#fff', padding: '6px 12px', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '8px' }}>
                  Edit
                </button>
                <button onClick={() => handleDeleteTask(task.id)} style={{ backgroundColor: '#dc3545', color: '#fff', padding: '6px 12px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>

        {/* Pagination */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px', gap: '8px' }}>
          {Array.from({ length: lastPage }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              style={{
                padding: '8px 12px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                backgroundColor: currentPage === page ? '#007bff' : '#f0f0f0',
                color: currentPage === page ? '#fff' : '#333',
                cursor: 'pointer',
              }}
            >
              {page}
            </button>
          ))}
        </div>
      </div>

      {/* Category Management */}
      <div style={{ backgroundColor: '#fff', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', borderRadius: '8px', padding: '24px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'semibold', marginBottom: '16px' }}>Categories</h2>
        <form onSubmit={editingCategory ? handleUpdateCategory : handleCreateCategory} style={{ marginBottom: '16px', display: 'flex', gap: '8px' }}>
          <input
            type="text"
            placeholder="Category Title"
            value={editingCategory ? editingCategory.title : newCategoryTitle}
            onChange={(e) => editingCategory ? setEditingCategory({ ...editingCategory, title: e.target.value }) : setNewCategoryTitle(e.target.value)}
            style={{ flex: '1', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
          <button type="submit" style={{ backgroundColor: '#007bff', color: '#fff', padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            {editingCategory ? 'Update Category' : 'Add Category'}
          </button>
          {editingCategory && (
            <button onClick={() => setEditingCategory(null)} style={{ backgroundColor: '#6c757d', color: '#fff', padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Cancel
            </button>
          )}
        </form>

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
  );
};

export default Dashboard;
