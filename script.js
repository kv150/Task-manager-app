// Selecting DOM Elements
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const filterBtns = document.querySelectorAll('.filter-btn');
const themeToggleBtn = document.getElementById('themeToggleBtn');

// 1. STATE MANAGEMENT (Load tasks from localStorage or initialize empty array)
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

// Render tasks and theme immediately when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    renderTasks();
    // Check saved theme from Local Storage
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-theme');
    }
});

// 2. CRUD OPERATIONS & DOM MANIPULATION

// [CREATE] - Add a new task
function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === '') return;

    const newTask = {
        id: Date.now(), // Unique ID using timestamp
        text: taskText,
        completed: false
    };

    tasks.push(newTask);
    saveAndRender();
    taskInput.value = ''; // Clear input field
}

// [READ & FILTER] - Display tasks on screen
function renderTasks() {
    taskList.innerHTML = ''; // Clear existing list

    // Filter tasks based on selected filter
    const filteredTasks = tasks.filter(task => {
        if (currentFilter === 'completed') return task.completed;
        if (currentFilter === 'pending') return !task.completed;
        return true; // for 'all'
    });

    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        if (task.completed) li.classList.add('completed');

        li.innerHTML = `
            <span>${task.text}</span>
            <div class="task-actions">
                <button class="edit-btn" onclick="editTask(${task.id})">Edit</button>
                <button onclick="toggleComplete(${task.id})">${task.completed ? 'Undo' : 'Done'}</button>
                <button class="delete-btn" onclick="deleteTask(${task.id})">X</button>
            </div>
        `;
        taskList.appendChild(li);
    });
}

// [UPDATE] - Toggle complete status
function toggleComplete(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            return { ...task, completed: !task.completed };
        }
        return task;
    });
    saveAndRender();
}

// [UPDATE] - Edit task text
function editTask(id) {
    const taskToEdit = tasks.find(task => task.id === id);
    const newText = prompt("Update your task:", taskToEdit.text);
    
    if (newText !== null && newText.trim() !== '') {
        taskToEdit.text = newText.trim();
        saveAndRender();
    }
}

// [DELETE] - Remove task
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveAndRender();
}

// Save data to Local Storage and refresh UI
function saveAndRender() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
}

// 3. EVENT LISTENERS

// Add task on button click or pressing Enter key
addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

// Filter buttons click logic
filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        filterBtns.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        currentFilter = e.target.getAttribute('data-filter');
        renderTasks();
    });
});

// Toggle dark/light theme and save preference to Local Storage
themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    
    // Remember theme choice
    if (document.body.classList.contains('dark-theme')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
});