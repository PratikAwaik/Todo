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


function modfiyOnHamburger() {
    const sideNav = document.querySelector(".side-nav");
    const projectTasks = document.querySelector(".project-tasks");
    const main = document.querySelector("main");
    
    if (hamburger.className.split(" ")[1] === undefined) {
        Variables.hamburgerActive = true;
        projectTasks.classList.add("hamburger-active");
        hamburger.classList.add("change");
        sideNav.classList.add("side-nav-active");
        projectTasks.style.display = "none";
        main.style.background = "#2020bc";

        [...hamburger.children].forEach((child) => child.style.backgroundColor = "rgb(240, 240, 240)");
    }
    else if (hamburger.className.split(" ")[1] === "change") {
        Variables.hamburgerActive = false;
        projectTasks.className = "project-tasks";
        hamburger.className = "hamburger";
        sideNav.className = "side-nav";
        projectTasks.style.display = "block";
        main.style.background = "";

        [...hamburger.children].forEach((child) => child.style.backgroundColor = "rgb(55, 55, 55)");
    }
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

displayAllProjects();

export {
    updateLocalStorage, 
    Variables
}
