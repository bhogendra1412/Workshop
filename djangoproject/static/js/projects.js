document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = '/api/projects/';
    let token = localStorage.getItem('token') || '';
    let username = localStorage.getItem('username') || '';

    const authSection = document.getElementById('auth-section');
    const loginSection = document.getElementById('login-section');
    const registerSection = document.getElementById('register-section');
    const projectsSection = document.getElementById('projects-section');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const createProjectForm = document.getElementById('create-project-form');
    const filterStatus = document.getElementById('filter-status');
    const projectList = document.getElementById('project-list');
    const logoutBtn = document.getElementById('logout-btn');
    const showRegisterBtn = document.getElementById('show-register');
    const showLoginBtn = document.getElementById('show-login');

    // Check if logged in
    if (token) {
        authSection.classList.add('hidden');
        projectsSection.classList.remove('hidden');
        fetchProjects();
    }

    // Toggle between login and register forms
    showRegisterBtn.addEventListener('click', () => {
        loginSection.classList.add('hidden');
        registerSection.classList.remove('hidden');
    });

    showLoginBtn.addEventListener('click', () => {
        registerSection.classList.add('hidden');
        loginSection.classList.remove('hidden');
    });

    // Login
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const usernameInput = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('/api/login/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: usernameInput, password })
            });
            const data = await response.json();
            if (response.ok) {
                token = data.token;
                username = data.username;
                localStorage.setItem('token', token);
                localStorage.setItem('username', username);
                authSection.classList.add('hidden');
                projectsSection.classList.remove('hidden');
                fetchProjects();
            } else {
                alert(data.non_field_errors || 'Login failed');
            }
        } catch (error) {
            alert('Error logging in');
        }
    });

    // Register
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const usernameInput = document.getElementById('register-username').value;
        const password = document.getElementById('register-password').value;

        try {
            const response = await fetch('/api/register/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: usernameInput, password })
            });
            const data = await response.json();
            if (response.ok) {
                token = data.token;
                username = data.username;
                localStorage.setItem('token', token);
                localStorage.setItem('username', username);
                authSection.classList.add('hidden');
                projectsSection.classList.remove('hidden');
                fetchProjects();
            } else {
                alert(data.username || data.password || 'Registration failed');
            }
        } catch (error) {
            alert('Error registering');
        }
    });

    // Logout
    logoutBtn.addEventListener('click', () => {
        token = '';
        username = '';
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        authSection.classList.remove('hidden');
        loginSection.classList.remove('hidden');
        registerSection.classList.add('hidden');
        projectsSection.classList.add('hidden');
        projectList.innerHTML = '';
    });

    // Fetch projects
    async function fetchProjects() {
        const statusFilter = filterStatus.value;
        try {
            const response = await fetch(`${apiUrl}${statusFilter ? `?status=${statusFilter}` : ''}`, {
                headers: { 'Authorization': `Token ${token}` }
            });
            const data = await response.json();
            renderProjects(data.results || data);
        } catch (error) {
            alert('Error fetching projects');
        }
    }

    // Render projects
    function renderProjects(projects) {
        projectList.innerHTML = '';
        if (projects.length === 0) {
            projectList.innerHTML = '<p class="text-gray-500">No projects found.</p>';
            return;
        }

        projects.forEach(project => {
            const div = document.createElement('div');
            div.className = 'bg-white p-4 rounded-lg shadow-md';
            div.innerHTML = `
                <h3 class="text-lg font-semibold">${project.title}</h3>
                <p>${project.description}</p>
                <p>Status: ${project.status}</p>
                <p>Owner: ${project.owner}</p>
                <p>Created: ${new Date(project.created_at).toLocaleString()}</p>
                <div class="flex gap-2 mt-2">
                    <button class="edit-btn bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600" data-id="${project.id}">Edit</button>
                    <button class="delete-btn bg-red-500 text-white p-2 rounded hover:bg-red-600" data-id="${project.id}">Delete</button>
                </div>
                <form class="edit-form hidden flex flex-col gap-4 mt-4" data-id="${project.id}">
                    <input type="text" class="edit-title p-2 border rounded" value="${project.title}" required>
                    <textarea class="edit-description p-2 border rounded" required>${project.description}</textarea>
                    <select class="edit-status p-2 border rounded">
                        <option value="PLANNING" ${project.status === 'PLANNING' ? 'selected' : ''}>Planning</option>
                        <option value="IN_PROGRESS" ${project.status === 'IN_PROGRESS' ? 'selected' : ''}>In Progress</option>
                        <option value="COMPLETED" ${project.status === 'COMPLETED' ? 'selected' : ''}>Completed</option>
                    </select>
                    <div class="flex gap-2">
                        <button type="submit" class="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Save</button>
                        <button type="button" class="cancel-btn bg-gray-500 text-white p-2 rounded hover:bg-gray-600">Cancel</button>
                    </div>
                </form>
            `;
            projectList.appendChild(div);
        });

        // Add event listeners for edit, delete, and cancel buttons
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.dataset.id;
                const form = document.querySelector(`.edit-form[data-id="${id}"]`);
                form.classList.toggle('hidden');
                e.target.classList.toggle('hidden');
            });
        });

        document.querySelectorAll('.cancel-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const form = e.target.closest('.edit-form');
                const id = form.dataset.id;
                form.classList.add('hidden');
                document.querySelector(`.edit-btn[data-id="${id}"]`).classList.remove('hidden');
            });
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const id = e.target.dataset.id;
                try {
                    const response = await fetch(`${apiUrl}${id}/`, {
                        method: 'DELETE',
                        headers: { 'Authorization': `Token ${token}` }
                    });
                    if (response.ok) {
                        fetchProjects();
                    } else {
                        alert('Failed to delete project');
                    }
                } catch (error) {
                    alert('Error deleting project');
                }
            });
        });

        document.querySelectorAll('.edit-form').forEach(form => {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const id = form.dataset.id;
                const title = form.querySelector('.edit-title').value;
                const description = form.querySelector('.edit-description').value;
                const status = form.querySelector('.edit-status').value;

                try {
                    const response = await fetch(`${apiUrl}${id}/`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Token ${token}`
                        },
                        body: JSON.stringify({ title, description, status })
                    });
                    if (response.ok) {
                        fetchProjects();
                    } else {
                        alert('Failed to update project');
                    }
                } catch (error) {
                    alert('Error updating project');
                }
            });
        });
    }

    // Create project
    createProjectForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('create-title').value;
        const description = document.getElementById('create-description').value;
        const status = document.getElementById('create-status').value;

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
                },
                body: JSON.stringify({ title, description, status })
            });
            if (response.ok) {
                document.getElementById('create-title').value = '';
                document.getElementById('create-description').value = '';
                document.getElementById('create-status').value = 'PLANNING';
                fetchProjects();
            } else {
                const error = await response.json();
                alert(error.detail || 'Failed to create project');
            }
        } catch (error) {
            alert('Error creating project');
        }
    });

    // Filter projects
    filterStatus.addEventListener('change', fetchProjects);
});