/* =====================================================
Elements
===================================================== */

const taskForm =
document.querySelector("#taskForm");

const taskInput =
document.querySelector("#taskInput");

const taskDate =
document.querySelector("#taskDate");

const tasksContainer =
document.querySelector("#tasksContainer");

const emptyState =
document.querySelector("#emptyState");

const taskCounter =
document.querySelector("#taskCounter");

const filterTasks =
document.querySelector("#filterTasks");

/* =====================================================
Tasks
===================================================== */

let tasks =
JSON.parse(
localStorage.getItem("tasks")
) || [];

/* =====================================================
Minimum Date
Prevent selecting an old date
===================================================== */

const today =
new Date()
.toISOString()
.split("T")[0];

taskDate.min = today;

/* =====================================================
Save Tasks
===================================================== */

function saveTasks() {

localStorage.setItem(
    "tasks",
    JSON.stringify(tasks)
);

}

/* =====================================================
Get Task Status
===================================================== */

function getTaskStatus(task) {

if (task.completed) {

    return "completed";
}


const today =
    new Date();

today.setHours(0, 0, 0, 0);


const dueDate =
    new Date(task.date);

dueDate.setHours(0, 0, 0, 0);


if (dueDate < today) {

    return "overdue";
}


return "pending";

}

/* =====================================================
Format Date
===================================================== */

function formatDate(date) {

return new Date(date)
    .toLocaleDateString(
        "en-US",
        {
            year: "numeric",
            month: "short",
            day: "numeric"
        }
    );

}

/* =====================================================
Add Task
===================================================== */

taskForm.addEventListener(
"submit",
function (event) {

    event.preventDefault();


    const title =
        taskInput.value.trim();

    const date =
        taskDate.value;


    /* Validation */

    if (!title) {

        alert(
            "Please enter a task."
        );

        taskInput.focus();

        return;
    }


    if (!date) {

        alert(
            "Please select a due date."
        );

        taskDate.focus();

        return;
    }


    /* Create Task */

    const newTask = {

        id: Date.now(),

        title: title,

        date: date,

        completed: false
    };


    tasks.push(newTask);


    saveTasks();

    renderTasks();


    /* Reset */

    taskForm.reset();

    taskDate.min = today;

    taskInput.focus();
}

);

/* =====================================================
Render Tasks
===================================================== */

function renderTasks() {

tasksContainer.innerHTML = "";


const filter =
    filterTasks.value;


let filteredTasks =
    tasks.filter((task) => {

        const status =
            getTaskStatus(task);

        if (filter === "all") {

            return true;
        }

        return status === filter;
    });


/* Sort by date */

filteredTasks.sort(
    (a, b) =>
        new Date(a.date) -
        new Date(b.date)
);


/* Empty State */

if (filteredTasks.length === 0) {

    emptyState.style.display = "block";

} else {

    emptyState.style.display = "none";
}


/* Create Cards */

filteredTasks.forEach(
    (task) => {

        const status =
            getTaskStatus(task);

        const taskCard =
            document.createElement("article");


        taskCard.className =
            `task-card ${status}`;


        taskCard.innerHTML = `

            <div class="task-info">

                <h3 class="task-title">
                    ${escapeHTML(task.title)}
                </h3>

                <p class="task-date">
                    📅 ${formatDate(task.date)}
                </p>

            </div>


            <span class="status ${status}">
                ${getStatusText(status)}
            </span>


            <div class="task-actions">

                <button
                    class="complete-btn"
                    data-id="${task.id}"
                    title="Complete"
                >
                    ✓
                </button>


                <button
                    class="edit-btn"
                    data-id="${task.id}"
                    title="Edit"
                >
                    ✎
                </button>


                <button
                    class="delete-btn"
                    data-id="${task.id}"
                    title="Delete"
                >
                    🗑
                </button>

            </div>
        `;


        tasksContainer.appendChild(
            taskCard
        );
    }
);


updateCounter();

}

/* =====================================================
Status Text
===================================================== */

function getStatusText(status) {

if (status === "completed") {

    return "Completed";
}


if (status === "overdue") {

    return "Overdue";
}


return "Pending";

}

/* =====================================================
Complete / Edit / Delete
===================================================== */

tasksContainer.addEventListener(
"click",
function (event) {

    const button =
        event.target.closest("button");


    if (!button) {

        return;
    }


    const id =
        Number(button.dataset.id);


    const task =
        tasks.find(
            (item) =>
                item.id === id
        );


    if (!task) {

        return;
    }


    /* Complete */

    if (
        button.classList.contains(
            "complete-btn"
        )
    ) {

        task.completed =
            !task.completed;

        saveTasks();

        renderTasks();

        return;
    }


    /* Edit */

    if (
        button.classList.contains(
            "edit-btn"
        )
    ) {

        const newTitle =
            prompt(
                "Edit your task:",
                task.title
            );


        if (
            newTitle !== null &&
            newTitle.trim() !== ""
        ) {

            task.title =
                newTitle.trim();

            saveTasks();

            renderTasks();
        }


        return;
    }


    /* Delete */

    if (
        button.classList.contains(
            "delete-btn"
        )
    ) {

        const confirmed =
            confirm(
                "Are you sure you want to delete this task?"
            );


        if (confirmed) {

            tasks =
                tasks.filter(
                    (item) =>
                        item.id !== id
                );


            saveTasks();

            renderTasks();
        }
    }

}

);

/* =====================================================
Filter
===================================================== */

filterTasks.addEventListener(
"change",
renderTasks
);

/* =====================================================
Counter
===================================================== */

function updateCounter() {

const count =
    tasks.length;


taskCounter.textContent =
    `${count} ${count === 1 ? "Task" : "Tasks"}`;

}

/* =====================================================
Security
Prevent HTML injection
===================================================== */

function escapeHTML(text) {

const div =
    document.createElement("div");

div.textContent = text;

return div.innerHTML;

}

/* =====================================================
Initial Render
===================================================== */

renderTasks();