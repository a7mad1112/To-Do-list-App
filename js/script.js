/* handle mode and mode toggler */
let displayMode = localStorage.getItem("mode") || "light";
displayMode === "dark" ?? document.body.classList.add("dark-display");
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
let tasks = JSON.parse(localStorage.getItem("tasks")) || {};

function getTasks() {
  completedAccordion.innerHTML = "";
  let template = "";
  tasks = JSON.parse(localStorage.getItem("tasks"));
  // console.log(tasks)
  /*
  tasks = {
    completed: [
      {
        title: "Task one",
        priority: "low",
        details: "details details",
        date: "Date: mon sep 13, 2023"
      },
      {
        title: "Task two",
        priority: "high",
        details: "details details",
        date: "Date: mon sep 13, 2023"
      },
    ],
    unCompleted: [
      {
        title: "Task 3",
        priority: "low",
        details: "details details",
        date: "Date: mon sep 13, 2023"
      },
      {
        title: "Task 4",
        priority: "medium",
        details: "details details",
        date: "Date: mon sep 13, 2023"
      },
    ]
  };
  */
  localStorage.setItem("tasks", JSON.stringify(tasks));
  tasks.completed.forEach((task, i) => {
    template += `
    <div class="content-box">
    <div class="task rounded-3 ${task.priority}-priority" aria-label="task">
      <div class="label">
        <span class="task-header">${task.title}</span>
      </div>
      <div class="task-actions">
        <span id="edit-task-btn">
          <i class="fa-solid fa-pen"></i>
        </span>
        <span id="delete-task-btn" role="button" aria-label="Delete task" onclick=deleteTheUnCompleted(${i})>
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
        <input type="checkbox" name="isComplete" onclick=UnCompleteTask(${i})>
      </p>
    </div>
  </div>
    `;
  });
  homeAccordion.innerHTML = template;
  template = "";
  tasks.unCompleted.forEach((task, i) => {
    // console.log(task.title)
    template += `
    <div class="content-box">
    <div class="task rounded-3 ${task.priority}-priority" aria-label="task">
      <div class="label">
        <span class="task-header">${task.title}</span>
      </div>
      <div class="task-actions">
        <span id="edit-task-btn">
          <i class="fa-solid fa-pen"></i>
        </span>
        <span id="delete-task-btn" role="button" aria-label="Delete task" onclick=deleteTheCompleted(${i})>
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
        <input type="checkbox" name="isComplete" checked onclick=CompleteTask(${i}) >
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
getTasks();
/* Handle complete and unComplete task checkbox */
function CompleteTask(index) {
  if (index < 0 || index >= tasks.unCompleted.length) return;
  tasks.completed.push(tasks.unCompleted.splice(index, 1)[0]);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  getTasks();
}

function UnCompleteTask(index) {
  if (index < 0 || index >= tasks.completed.length) return;
  tasks.unCompleted.push(tasks.completed.splice(index, 1)[0]);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  getTasks();
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
/* handle show and close adding new task form*/
document.getElementsByClassName("add-task")[0].onclick = () => {
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
document.getElementById("add-task-modal").addEventListener("submit", (e) => {
  e.preventDefault();
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
  getTasks();
  document.getElementById("add-task-form").style.display = "none";
});
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
  getTasks();
}
function deleteTheUnCompleted(index) {
  // console.l  og(tasks);
  tasks = {
    completed: tasks.completed.filter((e, i) => +i !== +index),
    unCompleted: tasks.unCompleted,
  };
  localStorage.setItem("tasks", JSON.stringify(tasks));
  getTasks();
}
