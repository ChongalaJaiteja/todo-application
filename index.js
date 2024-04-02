function loadTodoPendingTasks() {
    let stored = JSON.parse(localStorage.getItem("todoPendingList"));
    if (stored === null) return [];
    else return stored;
}
function loadTodoCompletedTasks() {
    let stored = JSON.parse(localStorage.getItem("todoCompletedList"));
    if (stored === null) {
        return [];
    } else {
        return stored;
    }
}
let todoPendingList = loadTodoPendingTasks();
let todoCompletedList = loadTodoCompletedTasks();
let uniqueId = 0;

function maxUniqueNo() {
    for (let task of todoPendingList) {
        uniqueId = Math.max(uniqueId, task.uniqueNo);
    }
    for (let task of todoCompletedList) {
        uniqueId = Math.max(uniqueId, task.uniqueNo);
    }
}
maxUniqueNo();

let myTasksContainer = document.getElementById("myTasksContainer");
let todoNavagationContainer = document.getElementById("todoNavagationContainer");
let pendingTasksContainer = document.getElementById("pendingTasksContainer");
let completedTasksContainer = document.getElementById("completedTasksContainer");
let pendingBtn = document.getElementById("pendingBtn");
let completedBtn = document.getElementById("completedBtn");
let userInput = document.getElementById("userInput");

function emptyTasksImage() {
    let pendingTasksContainerEmpty = document.getElementById("pendingTasksContainerEmpty");
    let completedTasksContainerEmpty = document.getElementById("completedTasksContainerEmpty");
    if (todoPendingList.length === 0) {
        pendingTasksContainerEmpty.classList.remove("d-none");
    } else {
        pendingTasksContainerEmpty.classList.add("d-none");
    }
    if (todoCompletedList.length === 0) {
        completedTasksContainerEmpty.classList.remove("d-none");
    } else {
        completedTasksContainerEmpty.classList.add("d-none");
    }
}

function updatingPendingAndCompletedTask() {
    let pendingTasksCount = document.getElementById("pendingTasksCount");
    let completedTasksCount = document.getElementById("completedTasksCount");
    pendingTasksCount.textContent = todoPendingList.length;
    completedTasksCount.textContent = todoCompletedList.length;
    if (todoCompletedList.length > 0) {
        clearCompletedTasksBtn.classList.remove("d-none");
    } else {
        clearCompletedTasksBtn.classList.add("d-none");
    }
    if (todoCompletedList.length === 0 && todoPendingList.length === 0) {
        myTasksContainer.classList.add("d-none");
        todoNavagationContainer.classList.add("d-none");
    } else {
        myTasksContainer.classList.remove("d-none");
        todoNavagationContainer.classList.remove("d-none");
    }
}

function storingPendingAndCompletedTasks() {
    localStorage.setItem("todoPendingList", JSON.stringify(todoPendingList));
    localStorage.setItem("todoCompletedList", JSON.stringify(todoCompletedList));
}

pendingBtn.onclick = function() {
    pendingTasksContainer.classList.remove("d-none");
    completedTasksContainer.classList.add("d-none");
    pendingBtn.classList.add("selected-btn");
    completedBtn.classList.remove("selected-btn");
};

completedBtn.onclick = function() {
    completedTasksContainer.classList.remove("d-none");
    pendingTasksContainer.classList.add("d-none");
    completedBtn.classList.add("selected-btn");
    pendingBtn.classList.remove("selected-btn");
};

function createAndAppendPendingTodo(newTodo) {
    if (todoPendingList.length > 0 || todoCompletedList.length > 0) {
        todoNavagationContainer.classList.remove("d-none");
        myTasksContainer.classList.remove("d-none");
    } 
    let {uniqueNo,task,isChecked} = newTodo;
    let todoItemId = "todo" + uniqueNo;
    let checkboxId = "checkbox" + uniqueNo;
    let labelElementId = "label" + uniqueNo;
    let deleteIconId = "delete" + uniqueNo;
    let todoElement = document.createElement("li");
    todoElement.id = todoItemId;
    todoElement.classList.add("d-flex", "mt-3");

    let checkBoxInput = document.createElement("input");
    checkBoxInput.type = "checkbox";
    checkBoxInput.classList.add("checkbox-input");
    checkBoxInput.id = checkboxId;
    checkBoxInput.checked = isChecked;
    todoElement.appendChild(checkBoxInput);

    let labelElementContainer = document.createElement("div");
    labelElementContainer.classList.add("label-element-container", "d-flex", "flex-row");
    todoElement.appendChild(labelElementContainer);

    let labelElement = document.createElement("label");
    labelElement.setAttribute("for", checkboxId);
    labelElement.textContent = task;
    labelElement.classList.add("checkbox-label");
    labelElement.id = labelElementId;
    labelElementContainer.appendChild(labelElement);

    let deleteIcon = document.createElement("i");
    deleteIcon.classList.add("fa-solid", "fa-trash-can", "delete-icon");
    let deleteIconContainer = document.createElement("div");
    deleteIconContainer.classList.add("delete-icon-container", "d-none");
    deleteIconContainer.id = deleteIconId;
    deleteIconContainer.appendChild(deleteIcon);
    labelElementContainer.appendChild(deleteIconContainer);

    if (checkBoxInput.checked === true) {
        labelElement.classList.add("completed-task");
        completedTasksContainer.appendChild(todoElement);
        deleteIconContainer.classList.remove("d-none");
        deleteIconContainer.onclick = function() {
            onDeleteTodo(todoItemId);
        };
    } else {
        labelElement.classList.remove("completed-task");
        pendingTasksContainer.appendChild(todoElement);
        deleteIconContainer.classList.add("d-none");
    }
    checkBoxInput.onclick = function() {
        changeTodoItemStatus(todoItemId, labelElementId, checkboxId, deleteIconId);
    };
    emptyTasksImage();
    updatingPendingAndCompletedTask();
    storingPendingAndCompletedTasks();
}

function add() {
    let userInputValue = userInput.value.trim();
    if (userInputValue === "") {
        alert("Invalid input");
        return;
    } else {
        let index = todoPendingList.findIndex(function(item) {
            if (item.task.split(" ").join("").toLowerCase() === userInputValue.split(" ").join("").toLowerCase()) {
                return true;
            } else {
                return false;
            }
        });
        if (index !== -1) {
            alert("Task already exists!");
            return;
        } else {
            uniqueId++;
            userInput.value = "";
            let newTodo = {
                task: userInputValue,
                uniqueNo: uniqueId,
                isChecked: false
            };
            todoPendingList.push(newTodo);
            createAndAppendPendingTodo(newTodo);
        }
    }
}
let addBtn = document.getElementById("addBtn");
let eraseInput = document.getElementById("eraseInput");
let saveBtn = document.getElementById("saveBtn");

userInput.addEventListener("keyup", function(event) {
    if (event.key === "Backspace") {
        addBtn.classList.add("d-none");
        eraseInput.classList.remove("d-none");
    } else {
        addBtn.classList.remove("d-none");
        eraseInput.classList.add("d-none");
    }
    if (event.key === "Enter") {
        add();
    }
    if (userInput.value.trim() === "") {
        addBtn.classList.remove("d-none");
        eraseInput.classList.add("d-none");
    }
});

eraseInput.onclick = function() {
    let userInput = document.getElementById("userInput");
    userInput.value = "";
};

function onDeleteTodo(todoId) {
    let todoItem = document.getElementById(todoId);
    completedTasksContainer.removeChild(todoItem);
    let deletedItemIndex = todoCompletedList.findIndex(function(item) {
        let eachTodoId = "todo" + item.uniqueNo;
        if (todoId === eachTodoId) {
            return true;
        } else {
            return false;
        }
    });
    todoCompletedList.splice(deletedItemIndex, 1);
    emptyTasksImage();
    updatingPendingAndCompletedTask();
    storingPendingAndCompletedTasks();
}

function changeTodoItemStatus(todoItemId, labelElementId, checkboxId, deleteIconId) {
    let todoItem = document.getElementById(todoItemId);
    let labelElement = document.getElementById(labelElementId);
    let checkboxInput = document.getElementById(checkboxId);
    let deleteIcon = document.getElementById(deleteIconId);
    if (checkboxInput.checked === true) {
        labelElement.classList.add("completed-task");
        pendingTasksContainer.removeChild(todoItem);
        completedTasksContainer.appendChild(todoItem);
        let pendingTask = todoPendingList.findIndex(function(item) {
            if (item.task === labelElement.textContent) {
                return true;
            } else {
                return false;
            }
        });
        todoPendingList[pendingTask].isChecked = true;
        todoCompletedList.push(todoPendingList[pendingTask]);
        todoPendingList.splice(pendingTask, 1);
        deleteIcon.classList.remove("d-none");
        deleteIcon.onclick = function() {
            onDeleteTodo(todoItemId);
        }
    } else {
        labelElement.classList.remove("completed-task");
        completedTasksContainer.removeChild(todoItem);
        pendingTasksContainer.appendChild(todoItem);
        let completedTask = todoCompletedList.findIndex(function(item) {
            if (item.task === labelElement.textContent) {
                return true;
            } else {
                return false;
            }
        });
        todoCompletedList[completedTask].isChecked = false;
        todoPendingList.push(todoCompletedList[completedTask]);
        todoCompletedList.splice(completedTask, 1);
        deleteIcon.classList.add("d-none");
    }
    emptyTasksImage();
    updatingPendingAndCompletedTask();
    storingPendingAndCompletedTasks();
}



let clearCompletedTasksBtn = document.getElementById("clearCompletedTasksBtn");
clearCompletedTasksBtn.onclick = function() {
    for (let items of todoCompletedList) {
        let completedTaskId = "todo" + items.uniqueNo;
        let completedTask = document.getElementById(completedTaskId);
        completedTasksContainer.removeChild(completedTask);
    }
    todoCompletedList.splice(0, todoCompletedList.length);
    emptyTasksImage();
    updatingPendingAndCompletedTask();
    storingPendingAndCompletedTasks();
};


for (let task of todoPendingList) {
    createAndAppendPendingTodo(task);
}

for (let task of todoCompletedList) {
    createAndAppendPendingTodo(task);
}
//Disableing right clicK on browser
document.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    }, false);