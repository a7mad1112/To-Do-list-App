/* handle mode and mode toggler */
let displayMode = localStorage.getItem("mode") || "light";
displayMode === "dark" ?? document.body.classList.add("dark-display");
let tasks = [];
let inputs = [
  ...document.querySelectorAll(
    "#add-task-modal input, #add-task-modal textarea, #add-task-modal select"
  ),
];
document.getElementById("display-mode").onclick = function () {
  displayMode = displayMode === "light" ? "dark" : "light";
  localStorage.setItem("mode", displayMode);
  displayMode === "dark"
    ? document.body.classList.add("display-dark")
    : document.body.classList.remove("display-dark");
};
/* toggle aside button */
document.getElementById("toggle-bar").onclick = function () {
  document.querySelector("body aside").classList.toggle("show-side");
};

/* function to get tasks from local storage and display them in home section*/
let [homeAccordion, completedAccordion] = [
  ...document.querySelectorAll(".my-accordion"),
];
getTasks();
function getTasks() {
  tasks = JSON.parse(localStorage.getItem("tasks")) || [];
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
    <p id="end-date" class="mt-1 ${hasDatePassed(task.date) ? "time-limit" : "null"}">Date: ${task.date}</p>
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

function displayTasks() {
  completedAccordion.innerHTML = "";
  let template = "";
  getTasks();
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
  tasks
    .filter((e) => !e.isComplete)
    .forEach((task) => {
      template += myTemplate(task);
    });
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
displayTasks();
/* Handle complete and unComplete task checkbox */
function CompleteTask(id) {
  // console.log(tasks);
  tasks.forEach((task) => {
    task.id === +id ? (task.isComplete = !task.isComplete) : null;
  });
  // console.log(tasks);
  storeTasks();
  displayTasks();
}

/* accordion toggler */
function accordionToggle() {
  const accordions = [...document.getElementsByClassName("content-box")];
  // console.log(accordions)
  accordions.forEach((element) => {
    element.querySelector(".label").addEventListener("click", function () {
      element.classList.toggle("active");
    });
  });
}
/* handle show and close adding new task form */
function changeFormString(title, submit) {
  document.querySelector("#add-task-form h3").innerHTML = title;
  document.querySelector("#add-task-form button").innerHTML = submit;
}

document.getElementsByClassName("add-task")[0].onclick = () => {
  changeFormString("New Task", "Create Task");
  inputs.forEach((e) => (e.value = ""));
  document.getElementById("add-task-modal").onsubmit = ADD_TASK;
  document.getElementById("add-task-form").classList.add("scale");
};

document.querySelector(".close-add-task-form").onclick = () => {
  document.getElementById("add-task-form").classList.remove("scale");
};
document
  .getElementById("add-task-form")
  .addEventListener("click", function (event) {
    if (event.target === this) {
      document.getElementById("add-task-form").classList.remove("scale");
    }
  });
/* input validation for add new task */
document.getElementById("task-name").addEventListener("input", (e) => {
  console.log(e.target.value);
  document.querySelector(".title-err").innerHTML = "";
  if (e.target.value.trim().length == 0) {
    document.querySelector(".title-err").innerHTML =
      "Task must include a title.";
  }
});
function validation() {
  return Boolean(document.getElementById("task-name").value);
}

/* handle submit form */
function ADD_TASK(e) {
  e.preventDefault();
  console.log(validation());
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
  // console.log(newTask);
  getTasks();
  tasks.push(newTask);
  storeTasks();
  /* empty and close the form */

  inputs.forEach((e) => (e.value = ""));
  displayTasks();
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
  displayTasks();
}
/* handle show and close edit task form */
function editTask(id) {
  getTasks();
  // console.log(tasks)
  let task = tasks.find((task) => task.id == id);
  // console.log(task);
  document.getElementById("add-task-form").classList.add("scale");
  inputs[0].value = task.title;
  inputs[1].value = task.details;
  inputs[2].value = task.priority;
  inputs[3].value = task.date;
  changeFormString("Edit Task", "Submit");
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
    }
    storeTasks();
    document.getElementById("add-task-form").classList.remove("scale");
    inputs.forEach((e) => (e.value = ""));
    displayTasks();
  };
}

/*

projects = [
  {name:, id , tasks: []}
]

*/
