import React from 'react';

const TaskBoard = ({ categories, tasks, onTaskCategoryUpdate }) => {
    const [draggedTask, setDraggedTask] = React.useState(null);

    const handleDragStart = (e, task) => {
        setDraggedTask(task);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e, categoryId) => {
        e.preventDefault();
        if (!draggedTask) return;

        const originalCategoryId = draggedTask.category[0]?.id;
        if (originalCategoryId === categoryId) {
            setDraggedTask(null);
            return;
        }

        onTaskCategoryUpdate(draggedTask.id, draggedTask.title, categoryId);
        setDraggedTask(null);
    };

    return (
        <div className="task-board" style={{ display: 'flex', gap: '16px', height: '80vh', overflowX: 'auto', paddingBottom: '16px' }}>
            {categories.map(category => (
                <div
                    key={category.id}
                    className="category-column"
                    style={{ flex: '0 0 250px', padding: '16px', backgroundColor: '#f4f5f7', borderRadius: '8px', display: 'flex', flexDirection: 'column' }}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, category.id)}
                >
                    <h2 style={{ fontSize: '1.25rem', marginBottom: '16px', flexShrink: 0 }}>{category.title}</h2>
                    <div className="task-list" style={{ minHeight: '200px', overflowY: 'auto', flexGrow: 1 }}>
                        {tasks
                            .filter(task => task.category[0]?.id === category.id)
                            .map(task => (
                                <div
                                    key={task.id}
                                    className="task-card"
                                    style={{ padding: '12px', backgroundColor: 'white', borderRadius: '4px', marginBottom: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.1)', cursor: 'grab' }}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, task)}
                                >
                                    {task.title}
                                </div>
                            ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TaskBoard;