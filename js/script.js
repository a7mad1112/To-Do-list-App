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
  localStorage.setItem("tasks", JSON.stringify(tasks));
  */
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
        <span id="delete-task-btn" role="button" aria-label="Delete task">
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
        <input type="checkbox" name="isComplete" onclick=CompleteTask(${i})>
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
        <span id="delete-task-btn" role="button" aria-label="Delete task">
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
        <input type="checkbox" name="isComplete" checked onclick=UnCompleteTask(${i})>
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
  if (index < 0 || index >= tasks.completed.length) return;
  tasks.unCompleted.push(tasks.completed.splice(index, 1)[0]);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  getTasks();
}

function UnCompleteTask(index) {
  if (index < 0 || index >= tasks.unCompleted.length) return;
  tasks.completed.push(tasks.unCompleted.splice(index, 1)[0]);
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
  document.getElementById("add-task-form").style.display = "flex";
};
document.querySelector(".close-add-task-form").onclick = () => {
  document.getElementById("add-task-form").style.display = "none";
};

