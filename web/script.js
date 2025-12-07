// DevConnect Web App JavaScript

// Global State
let currentUser = null;
let currentTab = 'recent';
let selectedTechnologies = [];

// Technology suggestions
const techSuggestions = [
    'React', 'Vue.js', 'Angular', 'Node.js', 'Express', 'Next.js', 'Nuxt.js',
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'PHP', 'Ruby',
    'HTML', 'CSS', 'SASS', 'Tailwind CSS', 'Bootstrap', 'Material UI',
    'MongoDB', 'PostgreSQL', 'MySQL', 'Firebase', 'Supabase',
    'Docker', 'Kubernetes', 'AWS', 'Azure', 'Google Cloud',
    'Git', 'GitHub', 'GitLab', 'Figma', 'Adobe XD'
];

// Sample projects data
const sampleProjects = [
    {
        id: 1,
        title: "E-commerce Platform",
        description: "Uma plataforma completa de e-commerce com React, Node.js e MongoDB. Inclui carrinho de compras, pagamentos e painel administrativo.",
        imageUrl: "https://via.placeholder.com/400x200/1DA1F2/FFFFFF?text=E-commerce",
        repositoryUrl: "https://github.com/user/ecommerce",
        demoUrl: "https://ecommerce-demo.com",
        technologies: ["React", "Node.js", "MongoDB", "Express"],
        authorId: 1,
        authorName: "João Silva",
        createdAt: Date.now() - 86400000,
        likeCount: 42,
        viewCount: 156,
        shareCount: 8,
        isLiked: false
    },
    {
        id: 2,
        title: "Task Manager App",
        description: "Aplicativo de gerenciamento de tarefas com Vue.js e Firebase. Funcionalidades de arrastar e soltar, notificações e colaboração em tempo real.",
        imageUrl: "https://via.placeholder.com/400x200/00D4FF/FFFFFF?text=Task+Manager",
        repositoryUrl: "https://github.com/user/taskmanager",
        demoUrl: "https://taskmanager-demo.com",
        technologies: ["Vue.js", "Firebase", "Vuetify", "JavaScript"],
        authorId: 2,
        authorName: "Maria Santos",
        createdAt: Date.now() - 172800000,
        likeCount: 28,
        viewCount: 89,
        shareCount: 5,
        isLiked: true
    },
    {
        id: 3,
        title: "Weather Dashboard",
        description: "Dashboard meteorológico com Angular e APIs externas. Mostra previsão do tempo, mapas interativos e alertas meteorológicos.",
        imageUrl: "https://via.placeholder.com/400x200/FFD700/000000?text=Weather+App",
        repositoryUrl: "https://github.com/user/weather",
        demoUrl: null,
        technologies: ["Angular", "TypeScript", "Chart.js", "API"],
        authorId: 3,
        authorName: "Pedro Costa",
        createdAt: Date.now() - 259200000,
        likeCount: 15,
        viewCount: 67,
        shareCount: 3,
        isLiked: false
    }
];

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Show loading screen
    showLoading();
    
    // Check if user is logged in
    const savedUser = localStorage.getItem('devconnect_user');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        setTimeout(() => {
            hideLoading();
            showScreen('main');
            loadProjects();
        }, 1500);
    } else {
        setTimeout(() => {
            hideLoading();
            showScreen('login');
        }, 1500);
    }
    
    // Initialize event listeners
    initializeEventListeners();
    
    // Initialize tech suggestions
    initializeTechSuggestions();
}

function initializeEventListeners() {
    // Login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Register form
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    
    // Create project form
    const createProjectForm = document.getElementById('create-project-form');
    if (createProjectForm) {
        createProjectForm.addEventListener('submit', handleCreateProject);
    }
    
    // Tech input
    const techInput = document.getElementById('tech-input');
    if (techInput) {
        techInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                addTechnology();
            }
        });
        
        techInput.addEventListener('input', function() {
            updateTechSuggestions(this.value);
        });
    }
    
    // Close profile dropdown when clicking outside
    document.addEventListener('click', function(e) {
        const profileMenu = document.querySelector('.profile-menu');
        const dropdown = document.getElementById('profile-dropdown');
        
        if (profileMenu && dropdown && !profileMenu.contains(e.target)) {
            dropdown.classList.remove('show');
        }
    });
}

function showLoading() {
    const loading = document.getElementById('loading');
    if (loading) {
        loading.style.display = 'flex';
    }
}

function hideLoading() {
    const loading = document.getElementById('loading');
    if (loading) {
        loading.style.display = 'none';
    }
}

function showScreen(screenName) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.add('hidden');
    });
    
    // Show target screen
    const targetScreen = document.getElementById(screenName + '-screen');
    if (targetScreen) {
        targetScreen.classList.remove('hidden');
    }
    
    // Update current screen
    window.currentScreen = screenName;
}

// Authentication functions
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value.trim();
    
    // Clear previous errors
    clearErrors();
    
    // Validate inputs
    if (!validateLoginInputs(email, password)) {
        return;
    }
    
    // Check if user exists
    const users = JSON.parse(localStorage.getItem('devconnect_users') || '[]');
    const user = users.find(u => u.email === email);
    
    if (!user) {
        showError('login-email-error', 'Usuário não encontrado');
        return;
    }
    
    // Simple password check (in real app, use proper hashing)
    if (user.password !== password) {
        showError('login-password-error', 'Senha incorreta');
        return;
    }
    
    // Login successful
    currentUser = user;
    localStorage.setItem('devconnect_user', JSON.stringify(user));
    
    showToast('success', 'Login realizado com sucesso!');
    showScreen('main');
    loadProjects();
}

function handleRegister(e) {
    e.preventDefault();
    
    const username = document.getElementById('register-username').value.trim();
    const fullName = document.getElementById('register-fullname').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value.trim();
    
    // Clear previous errors
    clearErrors();
    
    // Validate inputs
    if (!validateRegisterInputs(username, email, password)) {
        return;
    }
    
    // Check if user already exists
    const users = JSON.parse(localStorage.getItem('devconnect_users') || '[]');
    
    if (users.find(u => u.email === email)) {
        showError('register-email-error', 'Email já cadastrado');
        return;
    }
    
    if (users.find(u => u.username === username)) {
        showError('register-username-error', 'Username já existe');
        return;
    }
    
    // Create new user
    const newUser = {
        id: Date.now(),
        username,
        fullName: fullName || username,
        email,
        password, // In real app, hash this
        isPremium: false,
        createdAt: Date.now()
    };
    
    users.push(newUser);
    localStorage.setItem('devconnect_users', JSON.stringify(users));
    
    // Auto login
    currentUser = newUser;
    localStorage.setItem('devconnect_user', JSON.stringify(newUser));
    
    showToast('success', 'Conta criada com sucesso!');
    showScreen('main');
    loadProjects();
}

function validateLoginInputs(email, password) {
    let isValid = true;
    
    if (!email) {
        showError('login-email-error', 'Email é obrigatório');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showError('login-email-error', 'Email inválido');
        isValid = false;
    }
    
    if (!password) {
        showError('login-password-error', 'Senha é obrigatória');
        isValid = false;
    } else if (password.length < 6) {
        showError('login-password-error', 'Senha deve ter pelo menos 6 caracteres');
        isValid = false;
    }
    
    return isValid;
}

function validateRegisterInputs(username, email, password) {
    let isValid = true;
    
    if (!username) {
        showError('register-username-error', 'Username é obrigatório');
        isValid = false;
    } else if (username.length < 3) {
        showError('register-username-error', 'Username deve ter pelo menos 3 caracteres');
        isValid = false;
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        showError('register-username-error', 'Username deve conter apenas letras, números e _');
        isValid = false;
    }
    
    if (!email) {
        showError('register-email-error', 'Email é obrigatório');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showError('register-email-error', 'Email inválido');
        isValid = false;
    }
    
    if (!password) {
        showError('register-password-error', 'Senha é obrigatória');
        isValid = false;
    } else if (password.length < 6) {
        showError('register-password-error', 'Senha deve ter pelo menos 6 caracteres');
        isValid = false;
    }
    
    return isValid;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
    }
}

function clearErrors() {
    document.querySelectorAll('.error-message').forEach(element => {
        element.textContent = '';
    });
}

function logout() {
    currentUser = null;
    localStorage.removeItem('devconnect_user');
    showToast('info', 'Logout realizado com sucesso!');
    showScreen('login');
}

// Project functions
function loadProjects() {
    const projectsList = document.getElementById('projects-list');
    const emptyState = document.getElementById('empty-state');
    
    if (!projectsList || !emptyState) return;
    
    // Get projects from localStorage or use sample data
    let projects = JSON.parse(localStorage.getItem('devconnect_projects') || '[]');
    
    // If no projects, use sample data
    if (projects.length === 0) {
        projects = sampleProjects;
        localStorage.setItem('devconnect_projects', JSON.stringify(projects));
    }
    
    // Filter projects based on current tab
    let filteredProjects = projects;
    if (currentTab === 'recent') {
        filteredProjects = projects.sort((a, b) => b.createdAt - a.createdAt);
    } else if (currentTab === 'popular') {
        filteredProjects = projects.sort((a, b) => b.likeCount - a.likeCount);
    }
    
    if (filteredProjects.length === 0) {
        projectsList.style.display = 'none';
        emptyState.style.display = 'block';
    } else {
        projectsList.style.display = 'grid';
        emptyState.style.display = 'none';
        
        projectsList.innerHTML = filteredProjects.map(project => createProjectCard(project)).join('');
    }
}

function createProjectCard(project) {
    const timeAgo = getTimeAgo(project.createdAt);
    const imageHtml = project.imageUrl 
        ? `<img src="${project.imageUrl}" alt="${project.title}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
           <div class="project-image" style="display: none;"><i class="fas fa-image"></i></div>`
        : `<div class="project-image"><i class="fas fa-image"></i></div>`;
    
    return `
        <div class="project-card">
            <div class="project-image">
                ${imageHtml}
            </div>
            <div class="project-content">
                <h3 class="project-title">${project.title}</h3>
                <p class="project-description">${project.description}</p>
                <div class="project-author">
                    <i class="fas fa-user"></i>
                    <span>${project.authorName}</span>
                    <span>•</span>
                    <span>${timeAgo}</span>
                </div>
                <div class="project-technologies">
                    ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
                <div class="project-actions">
                    <div class="project-stats">
                        <span><i class="fas fa-heart${project.isLiked ? '' : '-o'}"></i> ${project.likeCount}</span>
                        <span><i class="fas fa-eye"></i> ${project.viewCount}</span>
                    </div>
                    <div class="project-links">
                        ${project.repositoryUrl ? `<a href="${project.repositoryUrl}" target="_blank" title="Repositório"><i class="fab fa-github"></i></a>` : ''}
                        ${project.demoUrl ? `<a href="${project.demoUrl}" target="_blank" title="Demo"><i class="fas fa-external-link-alt"></i></a>` : ''}
                        <a href="#" onclick="shareProject(${project.id})" title="Compartilhar"><i class="fas fa-share"></i></a>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function getTimeAgo(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (days > 0) {
        return `${days} dia${days > 1 ? 's' : ''} atrás`;
    } else if (hours > 0) {
        return `${hours} hora${hours > 1 ? 's' : ''} atrás`;
    } else if (minutes > 0) {
        return `${minutes} minuto${minutes > 1 ? 's' : ''} atrás`;
    } else {
        return 'Agora mesmo';
    }
}

function switchTab(tab) {
    currentTab = tab;
    
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    event.target.classList.add('active');
    
    // Reload projects
    loadProjects();
}

function handleCreateProject(e) {
    e.preventDefault();
    
    const title = document.getElementById('project-title').value.trim();
    const description = document.getElementById('project-description').value.trim();
    const imageUrl = document.getElementById('project-image').value.trim();
    const repositoryUrl = document.getElementById('project-repo').value.trim();
    const demoUrl = document.getElementById('project-demo').value.trim();
    
    // Clear previous errors
    clearErrors();
    
    // Validate inputs
    if (!title) {
        showError('project-title-error', 'Título é obrigatório');
        return;
    }
    
    // Check premium limits
    const projects = JSON.parse(localStorage.getItem('devconnect_projects') || '[]');
    const userProjects = projects.filter(p => p.authorId === currentUser.id);
    
    if (!currentUser.isPremium && userProjects.length >= 3) {
        showToast('error', 'Limite de projetos atingido! Upgrade para Premium para projetos ilimitados.');
        showScreen('premium');
        return;
    }
    
    // Create new project
    const newProject = {
        id: Date.now(),
        title,
        description: description || 'Sem descrição',
        imageUrl: imageUrl || null,
        repositoryUrl: repositoryUrl || null,
        demoUrl: demoUrl || null,
        technologies: [...selectedTechnologies],
        authorId: currentUser.id,
        authorName: currentUser.fullName || currentUser.username,
        createdAt: Date.now(),
        likeCount: 0,
        viewCount: 0,
        shareCount: 0,
        isLiked: false
    };
    
    projects.push(newProject);
    localStorage.setItem('devconnect_projects', JSON.stringify(projects));
    
    // Reset form
    document.getElementById('create-project-form').reset();
    selectedTechnologies = [];
    updateSelectedTechnologies();
    
    showToast('success', 'Projeto criado com sucesso!');
    showScreen('main');
    loadProjects();
}

// Technology functions
function initializeTechSuggestions() {
    updateTechSuggestions('');
}

function updateTechSuggestions(query) {
    const suggestionsContainer = document.getElementById('tech-suggestions');
    if (!suggestionsContainer) return;
    
    const filteredSuggestions = techSuggestions
        .filter(tech => 
            tech.toLowerCase().includes(query.toLowerCase()) && 
            !selectedTechnologies.includes(tech)
        )
        .slice(0, 8);
    
    suggestionsContainer.innerHTML = filteredSuggestions
        .map(tech => `<span class="tech-suggestion" onclick="selectTechnology('${tech}')">${tech}</span>`)
        .join('');
}

function selectTechnology(tech) {
    if (!selectedTechnologies.includes(tech)) {
        selectedTechnologies.push(tech);
        updateSelectedTechnologies();
        updateTechSuggestions('');
        const techInput = document.getElementById('tech-input');
        if (techInput) {
            techInput.value = '';
        }
    }
}

function addTechnology() {
    const input = document.getElementById('tech-input');
    if (!input) return;
    
    const tech = input.value.trim();
    
    if (tech && !selectedTechnologies.includes(tech)) {
        selectedTechnologies.push(tech);
        updateSelectedTechnologies();
        updateTechSuggestions('');
        input.value = '';
    }
}

function removeTechnology(tech) {
    const index = selectedTechnologies.indexOf(tech);
    if (index > -1) {
        selectedTechnologies.splice(index, 1);
        updateSelectedTechnologies();
        updateTechSuggestions('');
    }
}

function updateSelectedTechnologies() {
    const container = document.getElementById('selected-technologies');
    if (!container) return;
    
    container.innerHTML = selectedTechnologies
        .map(tech => `
            <span class="selected-tech">
                ${tech}
                <button type="button" class="remove-tech" onclick="removeTechnology('${tech}')">
                    <i class="fas fa-times"></i>
                </button>
            </span>
        `)
        .join('');
}

// Premium functions
function upgradeToPremium() {
    if (!currentUser) return;
    
    // Simulate premium upgrade
    currentUser.isPremium = true;
    currentUser.premiumExpiryDate = Date.now() + (30 * 24 * 60 * 60 * 1000); // 30 days
    
    // Update localStorage
    localStorage.setItem('devconnect_user', JSON.stringify(currentUser));
    
    // Update users array
    const users = JSON.parse(localStorage.getItem('devconnect_users') || '[]');
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex > -1) {
        users[userIndex] = currentUser;
        localStorage.setItem('devconnect_users', JSON.stringify(users));
    }
    
    showToast('success', 'Parabéns! Você agora é Premium! 🎉');
    showScreen('main');
}

// UI functions
function toggleProfileMenu() {
    const dropdown = document.getElementById('profile-dropdown');
    if (dropdown) {
        dropdown.classList.toggle('show');
    }
}

function shareProject(projectId) {
    // Simulate sharing
    showToast('info', 'Link do projeto copiado para a área de transferência!');
}

function showToast(type, message, title = '') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = type === 'success' ? 'check-circle' : 
                 type === 'error' ? 'exclamation-circle' : 
                 'info-circle';
    
    toast.innerHTML = `
        <i class="fas fa-${icon}"></i>
        <div class="toast-content">
            ${title ? `<div class="toast-title">${title}</div>` : ''}
            <div class="toast-message">${message}</div>
        </div>
    `;
    
    container.appendChild(toast);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 5000);
}

// Utility functions
function formatDate(timestamp) {
    return new Date(timestamp).toLocaleDateString('pt-BR');
}

function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

// Export functions for global access
window.showScreen = showScreen;
window.switchTab = switchTab;
window.toggleProfileMenu = toggleProfileMenu;
window.logout = logout;
window.addTechnology = addTechnology;
window.selectTechnology = selectTechnology;
window.removeTechnology = removeTechnology;
window.upgradeToPremium = upgradeToPremium;
window.shareProject = shareProject;

// Global State
let currentUser = null;
let currentTab = 'recent';
let selectedTechnologies = [];

// Technology suggestions
const techSuggestions = [
    'React', 'Vue.js', 'Angular', 'Node.js', 'Express', 'Next.js', 'Nuxt.js',
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'PHP', 'Ruby',
    'HTML', 'CSS', 'SASS', 'Tailwind CSS', 'Bootstrap', 'Material UI',
    'MongoDB', 'PostgreSQL', 'MySQL', 'Firebase', 'Supabase',
    'Docker', 'Kubernetes', 'AWS', 'Azure', 'Google Cloud',
    'Git', 'GitHub', 'GitLab', 'Figma', 'Adobe XD'
];

// Sample projects data
const sampleProjects = [
    {
        id: 1,
        title: "E-commerce Platform",
        description: "Uma plataforma completa de e-commerce com React, Node.js e MongoDB. Inclui carrinho de compras, pagamentos e painel administrativo.",
        imageUrl: "https://via.placeholder.com/400x200/1DA1F2/FFFFFF?text=E-commerce",
        repositoryUrl: "https://github.com/user/ecommerce",
        demoUrl: "https://ecommerce-demo.com",
        technologies: ["React", "Node.js", "MongoDB", "Express"],
        authorId: 1,
        authorName: "João Silva",
        createdAt: Date.now() - 86400000,
        likeCount: 42,
        viewCount: 156,
        shareCount: 8,
        isLiked: false
    },
    {
        id: 2,
        title: "Task Manager App",
        description: "Aplicativo de gerenciamento de tarefas com Vue.js e Firebase. Funcionalidades de arrastar e soltar, notificações e colaboração em tempo real.",
        imageUrl: "https://via.placeholder.com/400x200/00D4FF/FFFFFF?text=Task+Manager",
        repositoryUrl: "https://github.com/user/taskmanager",
        demoUrl: "https://taskmanager-demo.com",
        technologies: ["Vue.js", "Firebase", "Vuetify", "JavaScript"],
        authorId: 2,
        authorName: "Maria Santos",
        createdAt: Date.now() - 172800000,
        likeCount: 28,
        viewCount: 89,
        shareCount: 5,
        isLiked: true
    },
    {
        id: 3,
        title: "Weather Dashboard",
        description: "Dashboard meteorológico com Angular e APIs externas. Mostra previsão do tempo, mapas interativos e alertas meteorológicos.",
        imageUrl: "https://via.placeholder.com/400x200/FFD700/000000?text=Weather+App",
        repositoryUrl: "https://github.com/user/weather",
        demoUrl: null,
        technologies: ["Angular", "TypeScript", "Chart.js", "API"],
        authorId: 3,
        authorName: "Pedro Costa",
        createdAt: Date.now() - 259200000,
        likeCount: 15,
        viewCount: 67,
        shareCount: 3,
        isLiked: false
    }
];

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Show loading screen
    showLoading();
    
    // Check if user is logged in
    const savedUser = localStorage.getItem('devconnect_user');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        setTimeout(() => {
            hideLoading();
            showScreen('main');
            loadProjects();
        }, 1500);
    } else {
        setTimeout(() => {
            hideLoading();
            showScreen('login');
        }, 1500);
    }
    
    // Initialize event listeners
    initializeEventListeners();
    
    // Initialize tech suggestions
    initializeTechSuggestions();
}

function initializeEventListeners() {
    // Login form
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    
    // Register form
    document.getElementById('register-form').addEventListener('submit', handleRegister);
    
    // Create project form
    document.getElementById('create-project-form').addEventListener('submit', handleCreateProject);
    
    // Tech input
    const techInput = document.getElementById('tech-input');
    if (techInput) {
        techInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                addTechnology();
            }
        });
        
        techInput.addEventListener('input', function() {
            updateTechSuggestions(this.value);
        });
    }
    
    // Close profile dropdown when clicking outside
    document.addEventListener('click', function(e) {
        const profileMenu = document.querySelector('.profile-menu');
        const dropdown = document.getElementById('profile-dropdown');
        
        if (profileMenu && !profileMenu.contains(e.target)) {
            dropdown.classList.remove('show');
        }
    });
}

function showLoading() {
    document.getElementById('loading').style.display = 'flex';
}

function hideLoading() {
    document.getElementById('loading').style.display = 'none';
}

function showScreen(screenName) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.add('hidden');
    });
    
    // Show target screen
    const targetScreen = document.getElementById(screenName + '-screen');
    if (targetScreen) {
        targetScreen.classList.remove('hidden');
    }
    
    // Update current screen
    window.currentScreen = screenName;
}

// Authentication functions
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value.trim();
    
    // Clear previous errors
    clearErrors();
    
    // Validate inputs
    if (!validateLoginInputs(email, password)) {
        return;
    }
    
    // Check if user exists
    const users = JSON.parse(localStorage.getItem('devconnect_users') || '[]');
    const user = users.find(u => u.email === email);
    
    if (!user) {
        showError('login-email-error', 'Usuário não encontrado');
        return;
    }
    
    // Simple password check (in real app, use proper hashing)
    if (user.password !== password) {
        showError('login-password-error', 'Senha incorreta');
        return;
    }
    
    // Login successful
    currentUser = user;
    localStorage.setItem('devconnect_user', JSON.stringify(user));
    
    showToast('success', 'Login realizado com sucesso!');
    showScreen('main');
    loadProjects();
}

function handleRegister(e) {
    e.preventDefault();
    
    const username = document.getElementById('register-username').value.trim();
    const fullName = document.getElementById('register-fullname').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value.trim();
    
    // Clear previous errors
    clearErrors();
    
    // Validate inputs
    if (!validateRegisterInputs(username, email, password)) {
        return;
    }
    
    // Check if user already exists
    const users = JSON.parse(localStorage.getItem('devconnect_users') || '[]');
    
    if (users.find(u => u.email === email)) {
        showError('register-email-error', 'Email já cadastrado');
        return;
    }
    
    if (users.find(u => u.username === username)) {
        showError('register-username-error', 'Username já existe');
        return;
    }
    
    // Create new user
    const newUser = {
        id: Date.now(),
        username,
        fullName: fullName || username,
        email,
        password, // In real app, hash this
        isPremium: false,
        createdAt: Date.now()
    };
    
    users.push(newUser);
    localStorage.setItem('devconnect_users', JSON.stringify(users));
    
    // Auto login
    currentUser = newUser;
    localStorage.setItem('devconnect_user', JSON.stringify(newUser));
    
    showToast('success', 'Conta criada com sucesso!');
    showScreen('main');
    loadProjects();
}

function validateLoginInputs(email, password) {
    let isValid = true;
    
    if (!email) {
        showError('login-email-error', 'Email é obrigatório');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showError('login-email-error', 'Email inválido');
        isValid = false;
    }
    
    if (!password) {
        showError('login-password-error', 'Senha é obrigatória');
        isValid = false;
    } else if (password.length < 6) {
        showError('login-password-error', 'Senha deve ter pelo menos 6 caracteres');
        isValid = false;
    }
    
    return isValid;
}

function validateRegisterInputs(username, email, password) {
    let isValid = true;
    
    if (!username) {
        showError('register-username-error', 'Username é obrigatório');
        isValid = false;
    } else if (username.length < 3) {
        showError('register-username-error', 'Username deve ter pelo menos 3 caracteres');
        isValid = false;
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        showError('register-username-error', 'Username deve conter apenas letras, números e _');
        isValid = false;
    }
    
    if (!email) {
        showError('register-email-error', 'Email é obrigatório');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showError('register-email-error', 'Email inválido');
        isValid = false;
    }
    
    if (!password) {
        showError('register-password-error', 'Senha é obrigatória');
        isValid = false;
    } else if (password.length < 6) {
        showError('register-password-error', 'Senha deve ter pelo menos 6 caracteres');
        isValid = false;
    }
    
    return isValid;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
    }
}

function clearErrors() {
    document.querySelectorAll('.error-message').forEach(element => {
        element.textContent = '';
    });
}

function logout() {
    currentUser = null;
    localStorage.removeItem('devconnect_user');
    showToast('info', 'Logout realizado com sucesso!');
    showScreen('login');
}

// Project functions
function loadProjects() {
    const projectsList = document.getElementById('projects-list');
    const emptyState = document.getElementById('empty-state');
    
    // Get projects from localStorage or use sample data
    let projects = JSON.parse(localStorage.getItem('devconnect_projects') || '[]');
    
    // If no projects, use sample data
    if (projects.length === 0) {
        projects = sampleProjects;
        localStorage.setItem('devconnect_projects', JSON.stringify(projects));
    }
    
    // Filter projects based on current tab
    let filteredProjects = projects;
    if (currentTab === 'recent') {
        filteredProjects = projects.sort((a, b) => b.createdAt - a.createdAt);
    } else if (currentTab === 'popular') {
        filteredProjects = projects.sort((a, b) => b.likeCount - a.likeCount);
    }
    
    if (filteredProjects.length === 0) {
        projectsList.style.display = 'none';
        emptyState.style.display = 'block';
    } else {
        projectsList.style.display = 'grid';
        emptyState.style.display = 'none';
        
        projectsList.innerHTML = filteredProjects.map(project => createProjectCard(project)).join('');
    }
}

function createProjectCard(project) {
    const timeAgo = getTimeAgo(project.createdAt);
    const imageHtml = project.imageUrl 
        ? `<img src="${project.imageUrl}" alt="${project.title}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
           <div class="project-image" style="display: none;"><i class="fas fa-image"></i></div>`
        : `<div class="project-image"><i class="fas fa-image"></i></div>`;
    
    return `
        <div class="project-card">
            <div class="project-image">
                ${imageHtml}
            </div>
            <div class="project-content">
                <h3 class="project-title">${project.title}</h3>
                <p class="project-description">${project.description}</p>
                <div class="project-author">
                    <i class="fas fa-user"></i>
                    <span>${project.authorName}</span>
                    <span>•</span>
                    <span>${timeAgo}</span>
                </div>
                <div class="project-technologies">
                    ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
                <div class="project-actions">
                    <div class="project-stats">
                        <span><i class="fas fa-heart${project.isLiked ? '' : '-o'}"></i> ${project.likeCount}</span>
                        <span><i class="fas fa-eye"></i> ${project.viewCount}</span>
                    </div>
                    <div class="project-links">
                        ${project.repositoryUrl ? `<a href="${project.repositoryUrl}" target="_blank" title="Repositório"><i class="fab fa-github"></i></a>` : ''}
                        ${project.demoUrl ? `<a href="${project.demoUrl}" target="_blank" title="Demo"><i class="fas fa-external-link-alt"></i></a>` : ''}
                        <a href="#" onclick="shareProject(${project.id})" title="Compartilhar"><i class="fas fa-share"></i></a>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function getTimeAgo(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (days > 0) {
        return `${days} dia${days > 1 ? 's' : ''} atrás`;
    } else if (hours > 0) {
        return `${hours} hora${hours > 1 ? 's' : ''} atrás`;
    } else if (minutes > 0) {
        return `${minutes} minuto${minutes > 1 ? 's' : ''} atrás`;
    } else {
        return 'Agora mesmo';
    }
}

function switchTab(tab) {
    currentTab = tab;
    
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    event.target.classList.add('active');
    
    // Reload projects
    loadProjects();
}

function handleCreateProject(e) {
    e.preventDefault();
    
    const title = document.getElementById('project-title').value.trim();
    const description = document.getElementById('project-description').value.trim();
    const imageUrl = document.getElementById('project-image').value.trim();
    const repositoryUrl = document.getElementById('project-repo').value.trim();
    const demoUrl = document.getElementById('project-demo').value.trim();
    
    // Clear previous errors
    clearErrors();
    
    // Validate inputs
    if (!title) {
        showError('project-title-error', 'Título é obrigatório');
        return;
    }
    
    // Check premium limits
    const projects = JSON.parse(localStorage.getItem('devconnect_projects') || '[]');
    const userProjects = projects.filter(p => p.authorId === currentUser.id);
    
    if (!currentUser.isPremium && userProjects.length >= 3) {
        showToast('error', 'Limite de projetos atingido! Upgrade para Premium para projetos ilimitados.');
        showScreen('premium');
        return;
    }
    
    // Create new project
    const newProject = {
        id: Date.now(),
        title,
        description: description || 'Sem descrição',
        imageUrl: imageUrl || null,
        repositoryUrl: repositoryUrl || null,
        demoUrl: demoUrl || null,
        technologies: [...selectedTechnologies],
        authorId: currentUser.id,
        authorName: currentUser.fullName || currentUser.username,
        createdAt: Date.now(),
        likeCount: 0,
        viewCount: 0,
        shareCount: 0,
        isLiked: false
    };
    
    projects.push(newProject);
    localStorage.setItem('devconnect_projects', JSON.stringify(projects));
    
    // Reset form
    document.getElementById('create-project-form').reset();
    selectedTechnologies = [];
    updateSelectedTechnologies();
    
    showToast('success', 'Projeto criado com sucesso!');
    showScreen('main');
    loadProjects();
}

// Technology functions
function initializeTechSuggestions() {
    updateTechSuggestions('');
}

function updateTechSuggestions(query) {
    const suggestionsContainer = document.getElementById('tech-suggestions');
    if (!suggestionsContainer) return;
    
    const filteredSuggestions = techSuggestions
        .filter(tech => 
            tech.toLowerCase().includes(query.toLowerCase()) && 
            !selectedTechnologies.includes(tech)
        )
        .slice(0, 8);
    
    suggestionsContainer.innerHTML = filteredSuggestions
        .map(tech => `<span class="tech-suggestion" onclick="selectTechnology('${tech}')">${tech}</span>`)
        .join('');
}

function selectTechnology(tech) {
    if (!selectedTechnologies.includes(tech)) {
        selectedTechnologies.push(tech);
        updateSelectedTechnologies();
        updateTechSuggestions('');
        document.getElementById('tech-input').value = '';
    }
}

function addTechnology() {
    const input = document.getElementById('tech-input');
    const tech = input.value.trim();
    
    if (tech && !selectedTechnologies.includes(tech)) {
        selectedTechnologies.push(tech);
        updateSelectedTechnologies();
        updateTechSuggestions('');
        input.value = '';
    }
}

function removeTechnology(tech) {
    const index = selectedTechnologies.indexOf(tech);
    if (index > -1) {
        selectedTechnologies.splice(index, 1);
        updateSelectedTechnologies();
        updateTechSuggestions('');
    }
}

function updateSelectedTechnologies() {
    const container = document.getElementById('selected-technologies');
    if (!container) return;
    
    container.innerHTML = selectedTechnologies
        .map(tech => `
            <span class="selected-tech">
                ${tech}
                <button type="button" class="remove-tech" onclick="removeTechnology('${tech}')">
                    <i class="fas fa-times"></i>
                </button>
            </span>
        `)
        .join('');
}

// Premium functions
function upgradeToPremium() {
    if (!currentUser) return;
    
    // Simulate premium upgrade
    currentUser.isPremium = true;
    currentUser.premiumExpiryDate = Date.now() + (30 * 24 * 60 * 60 * 1000); // 30 days
    
    // Update localStorage
    localStorage.setItem('devconnect_user', JSON.stringify(currentUser));
    
    // Update users array
    const users = JSON.parse(localStorage.getItem('devconnect_users') || '[]');
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex > -1) {
        users[userIndex] = currentUser;
        localStorage.setItem('devconnect_users', JSON.stringify(users));
    }
    
    showToast('success', 'Parabéns! Você agora é Premium! 🎉');
    showScreen('main');
}

// UI functions
function toggleProfileMenu() {
    const dropdown = document.getElementById('profile-dropdown');
    dropdown.classList.toggle('show');
}

function shareProject(projectId) {
    // Simulate sharing
    showToast('info', 'Link do projeto copiado para a área de transferência!');
}

function showToast(type, message, title = '') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = type === 'success' ? 'check-circle' : 
                 type === 'error' ? 'exclamation-circle' : 
                 'info-circle';
    
    toast.innerHTML = `
        <i class="fas fa-${icon}"></i>
        <div class="toast-content">
            ${title ? `<div class="toast-title">${title}</div>` : ''}
            <div class="toast-message">${message}</div>
        </div>
    `;
    
    container.appendChild(toast);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 5000);
}

// Utility functions
function formatDate(timestamp) {
    return new Date(timestamp).toLocaleDateString('pt-BR');
}

function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

// Export functions for global access
window.showScreen = showScreen;
window.switchTab = switchTab;
window.toggleProfileMenu = toggleProfileMenu;
window.logout = logout;
window.addTechnology = addTechnology;
window.selectTechnology = selectTechnology;
window.removeTechnology = removeTechnology;
window.upgradeToPremium = upgradeToPremium;
window.shareProject = shareProject;