let todos = JSON.parse(localStorage.getItem('todos')) || [];
let editingId = null; 

renderTodos();

function addTodo() {
    const inputElem = document.querySelector('.js-todo-input');
    const todoText = inputElem.value;

    if (todoText.trim() !== '') {
        todos.push({
            id: Date.now(),
            text: todoText,
            completed: false
        });
        
        localStorage.setItem('todos', JSON.stringify(todos));
        renderTodos();
    } else {
        alert('할 일을 입력해주세요!');
    }

    inputElem.value = '';
}

function handleKeyDown(event) {
    if (event.key === 'Enter') {
        addTodo();
    }
}

function toggleComplete(id) {
    if (editingId !== null) {
        saveEdit(editingId);
    }

    todos.forEach(function(todo) {
        if (todo.id === id) {
            todo.completed = true;
        }
    });
    
    localStorage.setItem('todos', JSON.stringify(todos));
    renderTodos();
}

function editTodo(id) {
    if (editingId !== null) {
        saveEdit(editingId);
    }

    editingId = id;
    renderTodos();
}

function saveEdit(id) {
    const editElem = document.querySelector(`.edit-input-${id}`);
    
    if (!editElem) return; 

    const newText = editElem.value;

    if (newText.trim() !== '') {
        todos.forEach(function(todo) {
            if (todo.id === id) {
                todo.text = newText.trim();
            }
        });
        
        localStorage.setItem('todos', JSON.stringify(todos));
        editingId = null; 
        renderTodos();
    } else {
        alert('빈칸 X');
    }
}

function deleteTodo(id) {
    if (confirm('정말 삭제하시겠습니까?')) {
        if (editingId !== null) {
            saveEdit(editingId);
        }

        const newTodos = [];
        
        todos.forEach(function(todo) {
            if (todo.id !== id) {
                newTodos.push(todo);
            }
        });
        todos = newTodos;
        
        localStorage.setItem('todos', JSON.stringify(todos));
        renderTodos();
    }
}

function resetTodos() {
    todos = [];
    localStorage.removeItem('todos');
    renderTodos();
}

function renderTodos() {
    let html = '';
    
    todos.forEach(function(todo) {
        if (todo.id === editingId) {
            html += `
                <div class="todo-item">
                    <input type="text" class="edit-box edit-input-${todo.id}" value="${todo.text}">
                    <div class="btn-group">
                        <button class="action-btn" onclick="saveEdit(${todo.id})">저장</button>
                    </div>
                </div>
            `;
        } else {
            const completedClass = todo.completed ? 'completed' : '';
            
            html += `
                <div class="todo-item ${completedClass}">
                    <span class="todo-text">${todo.text}</span>
                    <div class="btn-group">
                        <button class="action-btn" onclick="toggleComplete(${todo.id})">완료</button>
                        <button class="action-btn" onclick="editTodo(${todo.id})">수정</button>
                        <button class="action-btn" onclick="deleteTodo(${todo.id})">삭제</button>
                    </div>
                </div>
            `;
        }
    });
    
    const listElem = document.querySelector('.js-todo-list');
    listElem.innerHTML = html;
}
