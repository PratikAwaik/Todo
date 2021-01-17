import { Project } from "./objects";
import { Variables, updateLocalStorage } from "./index";
import { displayCorrespondingTasks } from "./task";


let projectLists = document.getElementById("project-lists");

function addProjectToLocalStorage() {
    let titleInput = document.getElementById("title-input");
    if (titleInput.value) {
        Variables.myProjects.push(Project(titleInput.value));
        updateLocalStorage();
        titleInput.value = "";
        return true;
    }
    else return false;
}

function createProject(projectIndex) {
    let li = document.createElement("li");
    li.setAttribute("data-project-id", projectIndex);

    let deleteProjecBtn = document.createElement("button");
    deleteProjecBtn.classList.add("delete-project");
    let minusImg = document.createElement("img");
    minusImg.classList.add("minus-img");
    minusImg.setAttribute("src", "assests/images/minus-circle.svg");
    minusImg.setAttribute("alt", "Minus Sign");
    deleteProjecBtn.appendChild(minusImg);

    deleteProjecBtn.addEventListener("click", function() {
        deleteProject(projectIndex);
    });

    let taskListImg = document.createElement("img");
    taskListImg.classList.add("task-list-img");
    taskListImg.setAttribute("src", "assests/images/task-list.svg");
    taskListImg.setAttribute("alt", "Task List on Paper");   

    let titleBtn = document.createElement("button");
    titleBtn.classList.add("title");
    titleBtn.textContent = Variables.myProjects[projectIndex].title;

    titleBtn.addEventListener("click", function() {
        displayCorrespondingTasks(projectIndex);
        Variables.currProjectIndex = projectIndex;
        if (Variables.hamburgerActive) {
            const projectTasks = document.getElementById(Variables.currProjectIndex);
            projectTasks.classList.add("hamburger-active");
        }
        updateLocalStorage();
    })

    li.appendChild(deleteProjecBtn);
    li.appendChild(taskListImg);
    li.appendChild(titleBtn);

    projectLists.appendChild(li);
}

function displayAllProjects() {
   Variables.myProjects = JSON.parse(localStorage.getItem("myProjects")) || [];
   Variables.currProjectIndex = parseInt(localStorage.getItem("projectIndex")) || 0;
    for (let i = 0; i < Variables.myProjects.length; i++) {
        createProject(i);
        if (i == Variables.currProjectIndex) {
            displayCorrespondingTasks(i);
        }
    }
}

function deleteProject(projectIndex) {
    let projectLists = document.getElementById("project-lists");
    let lis = document.querySelectorAll("li");

    // remove all projects from DOM
    lis.forEach((li) => {
        projectLists.removeChild(li);
    });

    // remove the task body if only 1 project is left
    if (Variables.myProjects.length === 1) {
        let main = document.querySelector("main");
        main.removeChild(document.getElementById(projectIndex));
    }

    // remove project from localStorage
    Variables.myProjects.splice(projectIndex, 1);
    updateLocalStorage();

    // reset data-project-id of all lists
    for (let i = 0; i < Variables.myProjects.length; i++) {
        createProject(i);
        // show the tasks of last project
        if ((projectIndex === 0) && (i === projectIndex)) {
            displayCorrespondingTasks(i);
        }

        else if (i === projectIndex - 1) {
            displayCorrespondingTasks(i);
        }
    }
}


export {
    addProjectToLocalStorage, 
    createProject, 
    displayAllProjects
}