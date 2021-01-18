import {
    addProjectToLocalStorage, 
    createProject, 
    displayAllProjects
} from "./project";

import {
    addTaskToProject,
    displayCorrespondingTasks,
    createTask, 
    editTask, 
    editTaskInProject
} from "./task";

import { Project, Task } from "./objects";

const Particles = require("particlesjs");

const formPopup = document.getElementById("form-popup");
const addTaskForm = document.getElementById("add-task-form");
const addProjectForm = document.getElementById("add-project-form");
const addBtn = document.getElementById("add-btn");
const addProjectBtn = document.getElementById("add-project-btn");
const cancelBtn = document.getElementById("cancel-btn");
const hamburger = document.querySelector(".hamburger");

const Variables = {
    myProjects: [], 
    currProjectIndex: null, 
    currTaskIndex: null, 
    toEditTask: null, 
    toAddTask: null,
    hamburgerActive: null, 
}

addProjectBtn.addEventListener("click", function() {
    let validProject = addProjectToLocalStorage();
    if (validProject) {
        let projectIndex = JSON.parse(localStorage.getItem("myProjects")).length - 1 
        createProject(projectIndex);
        displayCorrespondingTasks(projectIndex);
    }
});

addBtn.addEventListener("click", function() {
    // first checks if the inputs given in the form are valid, then proceeds to create or edit the Task.
    if (Variables.toAddTask) {
        let validTaskAdd = addTaskToProject(Variables.currProjectIndex); 
        if (validTaskAdd) {
            let taskIndex = Variables.myProjects[Variables.currProjectIndex].tasks.length - 1;
            createTask(Variables.currProjectIndex, taskIndex);
            formPopup.style.display = "none";
        }
        else formPopup.style.display = "block";
    }

    else if (Variables.toEditTask) {
        let validTaskEdit = editTaskInProject(Variables.currProjectIndex, Variables.currTaskIndex);
        if (validTaskEdit) {
            editTask(Variables.currProjectIndex);
            formPopup.style.display = "none";
        }
        else formPopup.style.display = "block";
    }
});

cancelBtn.addEventListener("click", function() {
    formPopup.style.display = "none";
});

// prevent from refreshing the page
addTaskForm.addEventListener("submit", function(e) {
    handleForm(e);
});

addProjectForm.addEventListener("submit", function(e) {
    handleForm(e);
});

// modify elements when hamburger menu clicked
hamburger.addEventListener("click", modfiyOnHamburger);

// create Example Project when user first opens the page
if (JSON.parse(localStorage.getItem("myProjects")).length === 0) {
    createExampleProject();
}

else displayAllProjects();


function modfiyOnHamburger() {
    const sideNav = document.querySelector(".side-nav");
    const projectTasks = document.querySelector(".project-tasks");
    const main = document.querySelector("main");
    
    if (hamburger.className.split(" ")[1] === undefined) {
        Variables.hamburgerActive = true;
        hamburger.classList.add("change");
        sideNav.classList.add("side-nav-active");
        main.style.background = "#2020bc";

        [...hamburger.children].forEach((child) => child.style.backgroundColor = "rgb(240, 240, 240)");

        if (projectTasks != null) {
            projectTasks.classList.add("hamburger-active");
            projectTasks.style.display = "none";
        }
    }
    else if (hamburger.className.split(" ")[1] === "change") {
        Variables.hamburgerActive = false;
        hamburger.className = "hamburger";
        sideNav.className = "side-nav";
        main.style.background = "";

        [...hamburger.children].forEach((child) => child.style.backgroundColor = "rgb(55, 55, 55)");

        if (projectTasks != null) {
            projectTasks.className = "project-tasks";
            projectTasks.style.display = "block";
        }
    }
}

function createExampleProject() {
    const exampleProject = Project("Example Project");
    const task1 = Task("Example Task 1", "2021-01-18", "high", false);
    const task2 = Task("Example Task 2", "2021-01-18", "medium", false);
    const task3 = Task("Example Task 3", "2021-01-18", "low", false);
    exampleProject.tasks.push(task1);
    exampleProject.tasks.push(task2);
    exampleProject.tasks.push(task3);

    Variables.myProjects.push(exampleProject);
    updateLocalStorage();
    
    createProject(0);
    displayCorrespondingTasks(0);
}

function updateLocalStorage() {
    localStorage.setItem("myProjects", JSON.stringify(Variables.myProjects));
    localStorage.setItem("projectIndex", JSON.stringify(Variables.currProjectIndex));
}

function handleForm(e) {
    e.preventDefault();
}

// initialize particles.js
window.onload = function() {
    Particles.init({
        selector: ".background", 
        maxParticles: 200, 
        color: "#CCCCCC", 
        connectParticles: true,

        responsive: [
            {
                breakpoint: 1100, 
                options: {
                    maxParticles: 150
                }
            }, {
                breakpoint: 768, 
                options: {
                    maxParticles: 120, 
                    
                }
            }, {
                breakpoint: 540, 
                options: {
                    maxParticles: 60
                }
            }, {
                breakpoint: 425, 
                options: {
                    maxParticles: 35
                }
            }
        ]
    });
};

export {
    updateLocalStorage, 
    Variables
}
