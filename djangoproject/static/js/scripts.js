document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskList = document.getElementById('task-list');
    const taskInput = document.getElementById('task-description');

    // Fetch and display tasks
    const fetchTasks = async () => {
        try {
            const response = await fetch('/api/tasks/');
            const data = await response.json();
            taskList.innerHTML = '';
            data.tasks.forEach(task => {
                const li = document.createElement('li');
                li.textContent = `${task.description} (Created: ${new Date(task.created_at).toLocaleString()})`;
                taskList.appendChild(li);
            });
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    // Add new task
    taskForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const description = taskInput.value.trim();
        if (!description) return;

        try {
            const response = await fetch('/api/tasks/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ description })
            });
            if (response.ok) {
                taskInput.value = '';
                fetchTasks();
            } else {
                const error = await response.json();
                alert(error.error || 'Failed to add task');
            }
        } catch (error) {
            console.error('Error adding task:', error);
            alert('Error adding task');
        }
    });

    // Initial fetch
    fetchTasks();
});