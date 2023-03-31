/* handle mode and mode toggler */
let displayMode = localStorage.getItem("mode") || "light";
displayMode === "dark" ? document.body.classList.add("display-dark") : null;

let tasks = [];
let currentTasksState = [];
let currentSection = 1;
let inputs = [
  ...document.querySelectorAll(
    "#add-task-modal input, #add-task-modal textarea, #add-task-modal select"
  ),
];

function getCurrentTasksState() {
  let active = document.querySelector("aside ul li a.active");
  currentSection = active !== null ? +active.getAttribute("data-key") : 1;
  for (let i = 0; i < projects.length; i++) {
    if (projects[i].id === currentSection) {
      currentTasksState = projects[i].tasks;
      displayTasks(currentTasksState);
      break;
    }
  }
  if (active.id === "go-home") {
    currentSection = 1;
    getTasks();
  } else if (active.id === "go-today") {
    currentSection = 1;
    getTasksForCurrentDay();
  } else if (active.id === "go-week") {
    currentSection = 1;
    getTasksForNextSevenDays(tasks);
  }
}

const activeLi = document.querySelectorAll("aside ul li a");
let activeIndex = 0; // set the initial active index
let [homeAccordion, completedAccordion] = [
  ...document.querySelectorAll(".my-accordion"),
];
/* toggle aside button */
document.getElementById("toggle-bar").onclick = function () {
  document.querySelector("body aside").classList.toggle("show-side");
};

function changeFormString(title, submit) {
  document.querySelector("#add-task-form h3").innerHTML = title;
  document.querySelector("#add-task-form button").innerHTML = submit;
}

function addTask() {
  changeFormString("New Task", "Create Task");
  inputs.forEach((e) => (e.value = ""));
  document.getElementById("add-task-modal").onsubmit = ADD_TASK;
  document.getElementById("add-task-form").classList.add("scale");
}

function getTasksForCurrentDay() {
  const today = new Date().toDateString(); // get today's date in the format "Day Month Date Year"
  getTasks(); // retrieve the tasks array
  currentTasksState = tasks.filter((task) => {
    const taskDate = new Date(task.date).toDateString(); // convert the task's date to the same format
    return taskDate === today; // return true if the task's date matches today's date
  });
  displayTasks(currentTasksState);
}

function getTasksForNextSevenDays(tasks) {
  const today = new Date(); // get today's date
  const nextSevenDays = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + 7 // change this to 6 to include the current day
  ); // get the date for 7 days from now
  currentTasksState = tasks.filter((task) => {
    const taskDate = new Date(task.date); // convert the task's date to a Date object
    // return taskDate <= nextSevenDays;
    return taskDate >= today && taskDate <= nextSevenDays;
    // return taskDate >= today && taskDate <= nextSevenDays; // return true if the task's date falls within the next 7 days
  });
  displayTasks(currentTasksState);
}

function setupEventListeners() {
  [homeAccordion, completedAccordion] = [
    ...document.querySelectorAll(".my-accordion"),
  ];
  /* input validation for add new task */
  document.getElementById("task-name").oninput = (e) => {
    document.querySelector(".title-err").innerHTML = "";
    if (e.target.value.trim().length == 0) {
      document.querySelector(".title-err").innerHTML =
        "Task must include a title.";
    }
  };
  document.getElementById("display-mode").onclick = function () {
    displayMode = displayMode === "light" ? "dark" : "light";
    localStorage.setItem("mode", displayMode);
    displayMode === "dark"
      ? document.body.classList.add("display-dark")
      : document.body.classList.remove("display-dark");
  };
  /* handle show and close adding new task form */

  document.querySelector(".close-add-task-form").onclick = () => {
    document.getElementById("add-task-form").classList.remove("scale");
  };
  document.getElementById("add-task-form").onclick = function (event) {
    if (event.target === this) {
      document.getElementById("add-task-form").classList.remove("scale");
    }
  };

  // add event listener to go-home button
  document.getElementById("go-home").onclick = function () {
    document.getElementById("main-content").innerHTML = `
      <header class="mb-3">
            <h2 class="fs-3">Home</h2>
          </header>
          <div class="tasks-container w-100">
            <div class="add-task w-100 rounded" onclick="addTask()">
              <button class="w-100 rounded">
                <i class="fa-solid fa-plus add-project"></i>
                <span>Add new task</span>
              </button>
            </div>
            <div class="my-accordion">
              <!-- Tasks -->
    
              <!-- Tasks -->
            </div>
          </div>
          <h2 class="fs-6 mt-4">Complete Tasks</h2>
          <div class="my-accordion complete-tasks">
            <!-- Tasks -->
    
            <!-- Tasks -->
          </div>
      `;
    setupEventListeners();
    getTasks();
    displayTasks(currentTasksState);
  };

  document.getElementById("go-today").onclick = function () {
    document.getElementById("main-content").innerHTML = `
      <header class="mb-3">
            <h2 class="fs-3">Today</h2>
          </header>
          <div class="tasks-container w-100">
            <div class="my-accordion">
              <!-- Tasks -->
    
              <!-- Tasks -->
            </div>
          </div>
          <h2 class="fs-6 mt-4">Complete Tasks</h2>
          <div class="my-accordion complete-tasks">
            <!-- Tasks -->
    
            <!-- Tasks -->
          </div>
      `;
    setupEventListeners();
    getTasksForCurrentDay();
  };

  document.getElementById("go-week").onclick = function () {
    document.getElementById("main-content").innerHTML = `
      <header class="mb-3">
            <h2 class="fs-3">This Week</h2>
          </header>
          <div class="tasks-container w-100">
            <div class="my-accordion">
              <!-- Tasks -->
    
              <!-- Tasks -->
            </div>
          </div>
          <h2 class="fs-6 mt-4">Complete Tasks</h2>
          <div class="my-accordion complete-tasks">
            <!-- Tasks -->
    
            <!-- Tasks -->
          </div>
      `;
    setupEventListeners();
    getTasksForNextSevenDays(tasks);
  };

  /* toggle active for projects */
  activeLi.forEach((element, index) => {
    element.addEventListener("click", () => {
      getCurrentTasksState();
      activeIndex = setActiveElement(activeLi, activeIndex, index);
      [...document.querySelectorAll("#projects-container li a")].forEach((a) =>
        a.classList.remove("active")
      );
    });
  });
}

// call setupEventListeners initially
setupEventListeners();

/* function to get tasks from local storage and display them in home section*/

getTasks();
function getTasks() {
  tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  currentTasksState = tasks;
}
function storeTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function hasDatePassed(dateString) {
  // create a Date object for the given date string
  const date = new Date(dateString);

  // create a Date object for the current date
  const today = new Date();

  // compare the two dates and return true if the given date has passed
  return date < today;
}

function myTemplate(task) {
  return `
  <div class="content-box">
  <div class="task rounded-3 ${task.priority}-priority" aria-label="task">
    <div class="label">
      <span class="task-header">${task.title}</span>
    </div>
    <div class="task-actions">
      <span id="edit-task-btn" onclick=editTask(${task.id})>
        <i class="fa-solid fa-pen"></i>
      </span>
      <span id="delete-task-btn" role="button" aria-label="Delete task" onclick=deleteTask(${
        task.id
      })>
        <i class="fa-solid fa-trash"></i>
      </span>
    </div>
  </div>
  <div class="content rounded-bottom">
    <p>
      Details: ${task.details}
    </p>
    <p id="end-date" class="mt-1 ${
      hasDatePassed(task.date) ? "time-limit" : "null"
    }">Date: ${task.date}</p>
    <!-- <p class="priority">Priority: High</p> -->
    <p class="is-done text-end">
      <input type="checkbox" name="isComplete" ${
        task.isComplete ?? "checked"
      } onclick=CompleteTask(${task.id})>
    </p>
  </div>
</div>
  `;
}

function displayTasks(tasks) {
  completedAccordion.innerHTML = "";
  let template = "";

  if (tasks.filter((e) => !e.isComplete).length === 0)
    template = `
  <div class="relax-img">
            <img src="./imgs/relax.png" alt="relax">
            <p>You don't have any tasks, just relax!</p>
          </div>
  `;
  else {
    tasks
      .filter((e) => !e.isComplete)
      .forEach((task) => {
        template += myTemplate(task);
      });
  }
  homeAccordion.innerHTML = template;

  template = "";

  tasks
    .filter((e) => e.isComplete)
    .forEach((task) => {
      template += myTemplate(task);
    });
  completedAccordion.innerHTML = template;
  accordionToggle();
}
displayTasks(currentTasksState);
/* Handle complete and unComplete task checkbox */
function CompleteTask(id) {
  if (currentSection === 1) {
    currentTasksState.forEach((task) => {
      task.id === +id ? (task.isComplete = !task.isComplete) : null;
    });
    storeTasks();
    displayTasks(currentTasksState);
    return;
  }
  for (let i = 0; i < projects.length; i++) {
    for (let j = 0; j < projects[i].tasks.length; j++) {
      if (+id === projects[i].tasks[j].id) {
        projects[i].tasks[j].isComplete = !projects[i].tasks[j].isComplete;
        storeProjects();
        displayTasks(projects[i].tasks);
      }
    }
  }
}

/* accordion toggler */
function accordionToggle() {
  const accordions = [...document.getElementsByClassName("content-box")];
  accordions.forEach((element) => {
    element.querySelector(".label").addEventListener("click", function () {
      element.classList.toggle("active");
    });
  });
}

function validation() {
  return Boolean(document.getElementById("task-name").value);
}

/* handle submit form */
function ADD_TASK(e) {
  e.preventDefault();
  if (!validation()) return;
  let title = document.getElementById("task-name").value;
  let details = document.getElementById("task-details").value;
  let priority = document.getElementById("select-priority").value;
  let date = document.getElementById("due-date").value;
  let newTask = {
    title,
    priority,
    details,
    date,
    isComplete: false,
    id: Math.random() * 100 + 1,
  };
  getTasks();
  if (currentSection === 1) {
    tasks.push(newTask);
    displayTasks(tasks);
    storeTasks();
  } else {
    let i = 0;
    for (; i < projects.length; i++) {
      if (projects[i].id === currentSection) {
        projects[i].tasks.push(newTask);
        storeProjects();
        displayTasks(projects[i].tasks);
      }
    }
  }
  /* empty and close the form */

  inputs.forEach((e) => (e.value = ""));
  document.getElementById("add-task-form").classList.remove("scale");
}
/* change the color of dot after priority in the add form */
document
  .querySelector(".my-modal-content select")
  .addEventListener("input", function (e) {
    document
      .querySelector('label[for="select-priority"]')
      .setAttribute("data-color", e.target.value);
  });
/* handle delete task button */
function deleteTask(id) {
  getTasks();
  tasks = tasks.filter((t) => t.id != id);
  storeTasks();
  getCurrentTasksState();
  displayTasks(currentTasksState);
}
/* handle show and close edit task form */
function editTask(id) {
  document.getElementById("add-task-form").classList.add("scale");
  changeFormString("Edit Task", "Submit");
  let task = tasks.find((task) => task.id == id);
  inputs[0].value = task.title;
  inputs[1].value = task.details;
  inputs[2].value = task.priority;
  inputs[3].value = task.date;

  getTasks();
  document.getElementById("add-task-modal").onsubmit = function (e) {
    e.preventDefault();
    if (!validation()) return;
    let title = document.getElementById("task-name").value;
    let details = document.getElementById("task-details").value;
    let priority = document.getElementById("select-priority").value;
    let date = document.getElementById("due-date").value;
    let newTask = {
      title,
      priority,
      details,
      date,
      isComplete: false,
      id: Math.random() * 100 + 1,
    };
    for (let i = 0; i < tasks.length; i++) {
      if (id == tasks[i].id) {
        tasks[i] = { ...newTask, isComplete: tasks[i].isComplete };
      }
      if (currentTasksState[i].id == id)
        currentTasksState[i] = { ...newTask, isComplete: tasks[i].isComplete };
    }
    storeTasks();
    document.getElementById("add-task-form").classList.remove("scale");
    inputs.forEach((e) => (e.value = ""));
    getCurrentTasksState();
    displayTasks(currentTasksState);
  };
}
/* handle active bar */

function setActiveElement(elements, activeIndex, clickedIndex) {
  // remove the active class from the previously active element
  elements[activeIndex].classList.remove("active");
  // set the active class on the clicked element
  elements[clickedIndex].classList.add("active");

  // return the index of the new active element
  return clickedIndex;
}
/* Handle add projects */
let addProjectBtn = document.getElementById("add-project");
let projectsContainer = document.getElementById("projects-container");
let projects = [];

getProjects();

function getProjects() {
  projects = JSON.parse(localStorage.getItem("projects")) || [];
  // projects = ;
}
function storeProjects() {
  localStorage.setItem("projects", JSON.stringify(projects));
}
addProjectBtn.onclick = addProject;
function addProject() {
  const projectName = prompt("Write project name");
  if (projectName)
    if (projectName.trim()) {
      projects.push({
        name: projectName,
        id: Math.random() * 100 + 1,
        tasks: [],
      });
      storeProjects();
      displayProjects();
      location.reload();
    }
}

function resetContent() {
  document.getElementById("main-content").innerHTML = `
      <header class="mb-3">
            <h2 class="fs-3">Home</h2>
          </header>
          <div class="tasks-container w-100">
            <div class="add-task w-100 rounded" onclick="addTask()">
              <button class="w-100 rounded">
                <i class="fa-solid fa-plus add-project"></i>
                <span>Add new task</span>
              </button>
            </div>
            <div class="my-accordion">
              <!-- Tasks -->
    
              <!-- Tasks -->
            </div>
          </div>
          <h2 class="fs-6 mt-4">Complete Tasks</h2>
          <div class="my-accordion complete-tasks">
            <!-- Tasks -->
    
            <!-- Tasks -->
          </div>
      `;
  console.log("here");
}

function projectTemplate(project) {
  return `
  <li>
            <a href="#" data-key="${project.id}" onclick="resetContent()">
              <i class="fa-solid fa-list me-2"></i>
              <span>${project.name}</span>
              <div id="delete-project-btn" onclick="deleteProject(${project.id})">
                <i class="fa-solid fa-trash"></i>
              </div>
            </a>
          </li>
  `;
}

function deleteProject(id) {
  console.log("from deleteProject:  " + id);
  projects = projects.filter((p) => {
    // if (id === currentSection) currentSection = 1;
    console.log(currentSection);
    console.log(id);
    if (id === currentSection) {
      document.getElementById("go-home").click();
      document.getElementById("go-home").click();
    }
    return p.id !== id;
  });
  storeProjects();
  displayProjects();
}

function displayProjects() {
  let template = "";
  projects.forEach((proj) => {
    template += projectTemplate(proj);
  });
  projectsContainer.innerHTML = template;
}
displayProjects();
/* handle active item */
[...document.querySelectorAll("#projects-container li a")].forEach(
  (element) => {
    element.onclick = (e) => {
      // console.log(e.target.tagName === "path");
      if (e.target.tagName === "path") return;
      console.log(currentSection);
      if (currentSection !== 1) resetContent();
      [...document.querySelectorAll("#projects-container li a")].forEach(
        (ele) => ele.classList.remove("active")
      );
      activeLi.forEach((a) => a.classList.remove("active"));
      element.classList.add("active");
      getCurrentTasksState();
      getCurrentTasksState();
    };
  }
);
/*

projects = [
  {name:, id , tasks: []}
]

*/

/*
  tasks = [
    {
      title: "Task one",
      priority: "low",
      details: "details details",
      date: "mon sep 13, 2023",
      isComplete: false,
      id: 1,
    },
    {
      title: "Task two",
      priority: "high",
      details: "details details",
      date: "mon sep 13, 2023",
      isComplete: false,
      id: 2,
    },
    {
      title: "Task 3",
      priority: "low",
      details: "details details",
      date: "mon sep 13, 2023",
      isComplete: true,
      id: 3,
    },
    {
      title: "Task 4",
      priority: "medium",
      details: "details details",
      date: "mon sep 13, 2023",
      isComplete: true,
      id: 4,
    },
  ];
  storeTasks();
*/
