/* handle mode and mode toggler */
let displayMode = localStorage.getItem("mode") || "light";
displayMode === "dark" ?? document.body.classList.add("dark-display");
let tasks = [];
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
  tasks = JSON.parse(localStorage.getItem("tasks")) || {};
}
function storeTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function displayTasks() {
  completedAccordion.innerHTML = "";
  let template = "";
  getTasks();
  // console.log(tasks)
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
      template += `
    <div class="content-box">
    <div class="task rounded-3 ${task.priority}-priority" aria-label="task">
      <div class="label">
        <span class="task-header">${task.title}</span>
      </div>
      <div class="task-actions">
        <span id="edit-task-btn" onclick=editUnCompletedTask(${task.id})>
          <i class="fa-solid fa-pen"></i>
        </span>
        <span id="delete-task-btn" role="button" aria-label="Delete task" onclick=deleteTheUnCompleted(${task.id})>
          <i class="fa-solid fa-trash"></i>
        </span>
      </div>
    </div>
    <div class="content rounded-bottom">
      <p>
        Details: ${task.details}
      </p>
      <p id="end-date" class="mt-1">Date: ${task.date}</p>
      <!-- <p class="priority">Priority: High</p> -->
      <p class="is-done text-end">
        <input type="checkbox" name="isComplete" onclick=CompleteTask(${task.id})>
      </p>
    </div>
  </div>
    `;
    });
  homeAccordion.innerHTML = template;
  template = "";

  tasks
    .filter((e) => e.isComplete)
    .forEach((task) => {
      template += `
    <div class="content-box">
    <div class="task rounded-3 ${task.priority}-priority" aria-label="task">
      <div class="label">
        <span class="task-header">${task.title}</span>
      </div>
      <div class="task-actions">
        <span id="edit-task-btn" onclick=editCompletedTask(${task.id})>
          <i class="fa-solid fa-pen"></i>
        </span>
        <span id="delete-task-btn" role="button" aria-label="Delete task" onclick=deleteTheCompleted(${task.id})>
          <i class="fa-solid fa-trash"></i>
        </span>
      </div>
    </div>
    <div class="content rounded-bottom">
      <p>
        Details: ${task.details}
      </p>
      <p id="end-date" class="mt-1">Date: ${task.date}</p>
      <!-- <p class="priority">Priority: High</p> -->
      <p class="is-done text-end">
        <input type="checkbox" name="isComplete" checked onclick=CompleteTask(${task.id}) >
      </p>
    </div>
  </div>
    `;
    });
  completedAccordion.innerHTML = template;
  // console.log(tasks);
  // console.log(homeAccordion);
  // console.log(completedAccordion);
  accordionToggle();
}
displayTasks();
/* Handle complete and unComplete task checkbox */
function CompleteTask(id) {
  console.log(tasks)
  tasks.forEach((task) => {
    console.log(id)
    task.id === +id ? (task.isComplete = !task.isComplete) : null;
  });
  console.log(tasks)
  storeTasks();
  displayTasks();
}

// function UnCompleteTask(index) {
//   tasks.unCompleted.push(tasks.completed.splice(index, 1)[0]);
//   localStorage.setItem("tasks", JSON.stringify(tasks));
//   displayTasks();
// }

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
document.getElementsByClassName("add-task")[0].onclick = () => {
  document
    .getElementById("add-task-modal")
    .addEventListener("submit", ADD_TASK);

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
let validate = false;
document.getElementById("task-name").addEventListener("input", (e) => {
  document.querySelector(".title-err").innerHTML = "";
  validate = true;
  if (e.target.value.trim().length == 0) {
    document.querySelector(".title-err").innerHTML =
      "Task must include a title.";
    validate = false;
  }
});
/* handle submit form */
function ADD_TASK(e) {
  e.preventDefault();
  document.querySelector("#add-task-form h3").innerHTML = "New Task";
  document.querySelector("#add-task-form button").innerHTML = "Create Task";
  if (!validate) return;
  let title = document.getElementById("task-name").value;
  let details = document.getElementById("task-details").value;
  let priority = document.getElementById("select-priority").value;
  let date = document.getElementById("due-date").value;
  let newTask = {
    title,
    priority,
    details,
    date,
  };
  // console.log(newTask);
  let tasks = JSON.parse(localStorage.getItem("tasks")) || {};
  tasks.completed.push(newTask);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  /* empty and close the form */
  let inputs = [
    ...document.querySelectorAll(
      "#add-task-modal input, #add-task-modal textarea, #add-task-modal select"
    ),
  ];
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
function deleteTheCompleted(index) {
  // console.l  og(tasks);
  tasks = {
    completed: tasks.completed,
    unCompleted: tasks.unCompleted.filter((e, i) => +i !== +index),
  };
  localStorage.setItem("tasks", JSON.stringify(tasks));
  displayTasks();
}
function deleteTheUnCompleted(index) {
  // console.l  og(tasks);
  tasks = {
    completed: tasks.completed.filter((e, i) => +i !== +index),
    unCompleted: tasks.unCompleted,
  };
  localStorage.setItem("tasks", JSON.stringify(tasks));
  displayTasks();
}
/* handle show and close edit task form */

function editUnCompletedTask(index) {
  document.querySelector("#add-task-form h3").innerHTML = "Edit Task";
  document.querySelector("#add-task-form button").innerHTML = "Submit";
  document.getElementById("add-task-form").classList.add("scale");
  let newTask = {};
  let inputs = [
    ...document.querySelectorAll(
      "#add-task-modal input, #add-task-modal textarea, #add-task-modal select"
    ),
  ];
  inputs.forEach((e) => {
    const key = e.name;
    e.value = tasks.unCompleted[index][key];
  });
  document
    .getElementById("add-task-modal")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      if (!validate) return;
      let title = document.getElementById("task-name").value;
      let details = document.getElementById("task-details").value;
      let priority = document.getElementById("select-priority").value;
      let date = document.getElementById("due-date").value;
      newTask = {
        title,
        priority,
        details,
        date,
      };
      tasks = JSON.parse(localStorage.getItem("tasks")) || {};
      tasks.unCompleted = [
        ...tasks.unCompleted.filter((e, i) => i !== index),
        newTask,
      ];
      localStorage.setItem("tasks", JSON.stringify(tasks));
      inputs.forEach((e) => (e.value = ""));
      displayTasks();
      document.getElementById("add-task-form").classList.remove("scale");
    });
}

function editCompletedTask(index) {
  document.querySelector("#add-task-form h3").innerHTML = "Edit Task";
  document.querySelector("#add-task-form button").innerHTML = "Submit";
  document.getElementById("add-task-form").classList.add("scale");
  let newTask = {};
  let inputs = [
    ...document.querySelectorAll(
      "#add-task-modal input, #add-task-modal textarea, #add-task-modal select"
    ),
  ];
  inputs.forEach((e) => {
    const key = e.name;
    e.value = tasks.completed[index][key];
  });
  document
    .getElementById("add-task-modal")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      if (!validate) return;
      let title = document.getElementById("task-name").value;
      let details = document.getElementById("task-details").value;
      let priority = document.getElementById("select-priority").value;
      let date = document.getElementById("due-date").value;
      newTask = {
        title,
        priority,
        details,
        date,
      };
      tasks = JSON.parse(localStorage.getItem("tasks")) || {};
      tasks.completed = [
        ...tasks.completed.filter((e, i) => i !== index),
        newTask,
      ];
      localStorage.setItem("tasks", JSON.stringify(tasks));
      inputs.forEach((e) => (e.value = ""));
      displayTasks();
      document.getElementById("add-task-form").classList.remove("scale");
    });
}
