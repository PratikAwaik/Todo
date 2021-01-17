function Project(title) {
    let tasks = [];
    return {title, tasks};
}
 
function Task(name, dueDate, priority, completed) {
    return {name, dueDate, priority, completed};
}


export { Project, Task }
