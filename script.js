// 1. Get the necessary elements from the HTML
const taskInput = document.getElementById('task-input');
const addButton = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');
const clearAllButton = document.getElementById('clear-all-btn');

// --- 2. Event Listeners ---
addButton.addEventListener('click', addTaskHandler);
// Allow pressing 'Enter' to add the task
taskInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTaskHandler();
    }
});

// Load tasks from storage when the page first loads
document.addEventListener('DOMContentLoaded', loadTasks); 
clearAllButton.addEventListener('click', clearAllTasks);

// --- 3. Core Logic Functions ---

/**
 * Handles input value retrieval and initiates task creation.
 */
function addTaskHandler() {
    const taskText = taskInput.value.trim();
    if (taskText === '') {
        alert('Please enter a task!');
        return; 
    }
    
    // Create the visual element (new task is always incomplete)
    createTaskElement(taskText, false); 

    // Clear input and save the updated list state
    taskInput.value = '';
    saveTasks(); 
}


/**
 * Creates and configures the visual list item (LI) element.
 * @param {string} text - The task text.
 * @param {boolean} isCompleted - Whether the task should start as completed (used when loading).
 */
function createTaskElement(text, isCompleted) {
    const listItem = document.createElement('li');
    
    if (isCompleted) {
        listItem.classList.add('completed');
    }
    
    // Task Text Span
    const taskSpan = document.createElement('span');
    taskSpan.textContent = text;
    
    // Delete Icon (Font Awesome trash can)
    const deleteBtn = document.createElement('i');
    deleteBtn.className = 'fas fa-trash-alt delete-btn'; 
    
    // --- Event Listeners for the NEW item ---

    // Toggle 'completed' class and SAVE state on click
    taskSpan.addEventListener('click', () => {
        listItem.classList.toggle('completed');
        saveTasks(); 
    });

    // Remove item from the DOM and SAVE state on delete icon click
    deleteBtn.addEventListener('click', () => {
        listItem.remove();
        saveTasks(); 
    });

    // Append and add to the UL
    listItem.appendChild(taskSpan);
    listItem.appendChild(deleteBtn);
    todoList.appendChild(listItem);
}


// --- 4. Local Storage Functions ---

/**
 * Saves all current tasks in the list to local storage.
 */
function saveTasks() {
    const tasks = [];
    // Loop through every <li> element to gather its state
    todoList.querySelectorAll('li').forEach(item => {
        tasks.push({
            text: item.querySelector('span').textContent,
            completed: item.classList.contains('completed')
        });
    });

    // Convert the JS array into a JSON string and store it under the key 'todoTasks'
    localStorage.setItem('todoTasks', JSON.stringify(tasks));
}

/**
 * Loads tasks from local storage and rebuilds the list.
 */
function loadTasks() {
    const storedTasks = localStorage.getItem('todoTasks');

    if (storedTasks) {
        // Convert the JSON string back into a JS array
        const tasks = JSON.parse(storedTasks);
        
        // Rebuild the UI using the saved data
        tasks.forEach(task => {
            createTaskElement(task.text, task.completed);
        });
    }
}

function clearAllTasks() {
    // CRITICAL: Prompt the user for confirmation
    if (confirm("🚨 WARNING: Are you sure you want to delete ALL tasks? This action cannot be undone.")) {
        
        // 1. Clear the tasks from the visible list (UI)
        // This removes all <li> elements from the <ul>
        todoList.innerHTML = ''; 

        // 2. Clear the data from Local Storage (The 'backend' part)
        // Ensure the key 'todoTasks' matches the key used in saveTasks/loadTasks
        localStorage.removeItem('todoTasks'); 
        
        // OPTIONAL: Provide immediate feedback
        alert('All tasks have been successfully cleared!');
    }
}
/**
 * Creates and configures the visual list item (LI) element.
 * @param {string} text - The task text.
 * @param {boolean} isCompleted - Whether the task should start as completed (used when loading).
 */
function createTaskElement(text, isCompleted) {
    const listItem = document.createElement('li');
    
    // --- 1. CREATE THE CHECK/NULL ICON ---
    const statusIcon = document.createElement('i');
    statusIcon.classList.add('status-icon'); // Custom class for styling
    
    // Apply initial state (completed or incomplete)
    updateStatusIcon(statusIcon, isCompleted);
    
    if (isCompleted) {
        listItem.classList.add('completed');
    }
    
    // Task Text Span
    const taskSpan = document.createElement('span');
    taskSpan.textContent = text;
    taskSpan.classList.add('task-text'); // Custom class for styling
    
    // Delete Icon (Font Awesome trash can) - REMAINS THE SAME
    const deleteBtn = document.createElement('i');
    deleteBtn.className = 'fas fa-trash-alt delete-btn'; 
    
    // --- 2. APPEND ELEMENTS ---
    listItem.appendChild(statusIcon); // Add the new status icon
    listItem.appendChild(taskSpan);
    listItem.appendChild(deleteBtn);
    
    // --- 3. NEW & UPDATED EVENT LISTENERS ---

    // Toggle 'completed' class, update icon, and SAVE state
    statusIcon.addEventListener('click', () => {
        listItem.classList.toggle('completed');
        
        // Check the new state
        const newState = listItem.classList.contains('completed');
        updateStatusIcon(statusIcon, newState);
        
        saveTasks(); 
    });
    
    // You can also click the text to toggle completion
    taskSpan.addEventListener('click', () => {
        listItem.classList.toggle('completed');
        const newState = listItem.classList.contains('completed');
        updateStatusIcon(statusIcon, newState);
        saveTasks();
    });

    // Remove item and SAVE state
    deleteBtn.addEventListener('click', () => {
        listItem.remove();
        saveTasks(); 
    });

    todoList.appendChild(listItem);
}

// --- NEW HELPER FUNCTION ---
/**
 * Updates the Font Awesome classes based on the completion status.
 */
function updateStatusIcon(iconElement, isCompleted) {
    if (isCompleted) {
        // Change to a solid check circle (tick)
        iconElement.classList.remove('far', 'fa-circle');
        iconElement.classList.add('fas', 'fa-check-circle');
    } else {
        // Change to an empty regular circle (null)
        iconElement.classList.remove('fas', 'fa-check-circle');
        iconElement.classList.add('far', 'fa-circle');
    }
}