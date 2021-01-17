import { Task } from "./objects";
import { Variables, updateLocalStorage } from "./index";


const formPopup = document.getElementById("form-popup");

function addTaskToProject(projectIndex) {
    let taskName = document.getElementById("task-name");
    let dueDate = document.getElementById("due-date");
    let taskPriority = document.getElementById("task-priority");
    
    if (taskName.value && dueDate.value) {
        let newTask = Task(
            taskName.value, 
            dueDate.value,
            taskPriority.value, 
            false
        );
        Variables.myProjects[projectIndex].tasks.push(newTask);
        updateLocalStorage();
        taskName.value = dueDate.value = "";
        return true; 
    }
    return false;
}

function createTaskBody(projectIndex) {
    let projectTasks = document.createElement("div");
    projectTasks.classList.add("project-tasks");
    projectTasks.setAttribute("id", projectIndex);

    if (Variables.hamburgerActive) projectTasks.classList.add("hamburger-active");
    else projectTasks.className = "project-tasks";

    let projectTitle = document.createElement("div");
    projectTitle.classList.add("project-title");

    let projectTitleImg = document.createElement("img");
    projectTitleImg.setAttribute("src", "assests/images/task-list.svg");
    projectTitleImg.setAttribute("alt", "Task List on Paper");
    projectTitleImg.classList.add("project-title-img");

    let h1 = document.createElement("h1");
    h1.textContent = Variables.myProjects[projectIndex].title;

    projectTitle.appendChild(projectTitleImg);
    projectTitle.appendChild(h1);

    let taskHeader = document.createElement("div");
    taskHeader.classList.add("task-header");

    let h3 = document.createElement("h3");
    h3.textContent = "Tasks";

    let addTaskBtn = document.createElement("button");
    addTaskBtn.classList.add("add-task-btn");
    addTaskBtn.textContent = "+";

    addTaskBtn.addEventListener("click", function() {
        formPopup.style.display = "block";
        Variables.currProjectIndex = projectIndex;
        Variables.toAddTask = true;
        Variables.toEditTask = false;
        updateLocalStorage();
    });

    taskHeader.appendChild(h3);
    taskHeader.appendChild(addTaskBtn);

    let allTasks = document.createElement("div");
    allTasks.classList.add("all-tasks");

    projectTasks.appendChild(projectTitle);
    projectTasks.appendChild(taskHeader);
    projectTasks.appendChild(allTasks);

    let main = document.querySelector("main");
    main.appendChild(projectTasks);
}

function createTask(projectIndex, taskIndex) {
    let taskContainer = document.createElement("div");
    taskContainer.classList.add("task-container");
    taskContainer.setAttribute("data-task-id", taskIndex);

    let taskDetails = document.createElement("div");
    taskDetails.classList.add("task-details");

    let checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");
    checkbox.setAttribute("name", "completed");
    checkbox.classList.add("task-completed");

    let completed = Variables.myProjects[projectIndex].tasks[taskIndex].completed;   
    checkbox.addEventListener("change", function() {
        if (this.checked) {
            completed = true;
            updateLocalStorage();
            taskContainer.style.opacity = "0.3";
        }
        else {
            completed = false;
            updateLocalStorage();
            taskContainer.style.opacity = "1";
        }
    });

    if (completed) {
        taskContainer.style.opacity = "0.3";
        checkbox.checked = true;
    }
    else {
        taskContainer.style.opacity = "1";
    }
    

    let taskName = document.createElement("p");
    taskName.classList.add("task-name");
    let dueDate = document.createElement("span");
    dueDate.classList.add("due-date");
    let br = document.createElement("br");

    dueDate.textContent = Variables.myProjects[projectIndex].tasks[taskIndex].dueDate;
    taskName.textContent = Variables.myProjects[projectIndex].tasks[taskIndex].name;
    taskName.appendChild(br);
    taskName.appendChild(dueDate);

    taskDetails.appendChild(checkbox);
    taskDetails.appendChild(taskName);

    let modifyTaskBtns = document.createElement("div");
    modifyTaskBtns.classList.add("modify-task-btns");

    let editTaskBtn = document.createElement("button");
    editTaskBtn.classList.add("edit-task");
    let editImg = document.createElement("img");
    editImg.setAttribute("src", "assests/images/edit-button.svg");
    editImg.setAttribute("alt", "Edit Image");
    editTaskBtn.appendChild(editImg);

    editTaskBtn.addEventListener("click", function() {
        formPopup.style.display = "block";
        Variables.toEditTask = true, 
        Variables.toAddTask = false;
        Variables.currTaskIndex = taskIndex;
    });

    let deleteTaskBtn = document.createElement("button");
    deleteTaskBtn.classList.add("delete-task");
    let deleteImg = document.createElement("img");
    deleteImg.setAttribute("src", "assests/images/trash.svg");
    deleteImg.setAttribute("alt", "Trash Can Icon");
    deleteTaskBtn.appendChild(deleteImg);

    deleteTaskBtn.addEventListener("click", function() {
        deleteTask(projectIndex, taskIndex);
    });

    let taskPriority = document.createElement("div");
    taskPriority.classList.add("task-priority");
    let priority = Variables.myProjects[projectIndex].tasks[taskIndex].priority;
    if (priority === "high") {
        taskPriority.style.backgroundColor = "red";
    }
    else if (priority === "medium") {
        taskPriority.style.backgroundColor = "#474ce2";
    }
    else taskPriority.style.backgroundColor = "green";

    let hr = document.createElement("hr");

    modifyTaskBtns.appendChild(editTaskBtn);
    modifyTaskBtns.appendChild(deleteTaskBtn);

    taskContainer.appendChild(taskDetails);
    taskContainer.appendChild(modifyTaskBtns);
    taskContainer.appendChild(taskPriority);
    taskContainer.appendChild(hr);

    let allTasks = document.getElementById(`${projectIndex}`).children[2];
    allTasks.appendChild(taskContainer);
}

function displayCorrespondingTasks(projectIndex) {
    // displays Project along with its tasks

    let allProjectsTasks = document.querySelectorAll(".project-tasks");
    allProjectsTasks.forEach((projectsTasks) => {
        document.querySelector("main").removeChild(projectsTasks);
    });

    let lis = document.querySelectorAll("li");
    lis.forEach((li) => {
        if (li.getAttribute("data-project-id") == projectIndex) {
            li.children[2].style.color = "rgb(250, 250, 250)";
        }
        else li.children[2].style.color = "rgb(190, 190, 190)";
    });

    createTaskBody(projectIndex);
    // show all tasks 
    for (let i = 0; i < Variables.myProjects[projectIndex].tasks.length; i++) {
        createTask(projectIndex, i);
    }
}

function editTaskInProject(projectIndex, taskIndex) {
    let taskName = document.getElementById("task-name");
    let dueDate = document.getElementById("due-date");
    let taskPriority = document.getElementById("task-priority");

    if (taskName.value && dueDate.value) {
        let newTask = Task(
            taskName.value, 
            dueDate.value,
            taskPriority.value, 
            false
        );
    
        Variables.myProjects[projectIndex].tasks.splice(taskIndex, 1, newTask);
        updateLocalStorage();

        taskName.value = dueDate.value = "";
        return true;
    }   
    return false;
}

function editTask(projectIndex) {
    let allTasks = document.querySelector(".all-tasks");
    while (allTasks.hasChildNodes()) {
        allTasks.removeChild(allTasks.childNodes[0]);
    }

    for (let i = 0; i < Variables.myProjects[projectIndex].tasks.length; i++) {
        createTask(projectIndex, i);
    }
}

function deleteTask(projectIndex, taskIndex) {
    Variables.myProjects[projectIndex].tasks.splice(taskIndex, 1);
    updateLocalStorage();

    let allTasks = document.querySelector(".all-tasks");

    // remove task from alltasks
    let taskContainers = document.querySelectorAll(".task-container");
    taskContainers.forEach((container) => {
        if (container.getAttribute("data-task-id") == taskIndex) {
            allTasks.removeChild(container);
        }
    });

    // reset the indexes of the tasks
    for (let i = 0; i < allTasks.childNodes.length; i++) {
        allTasks.childNodes[i].setAttribute("data-task-id", i);
    }
}

export {
    createTaskBody, 
    displayCorrespondingTasks, 
    addTaskToProject,
    createTask, 
    editTask, 
    editTaskInProject
}